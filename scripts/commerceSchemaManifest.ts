import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type CommerceManifestColumn = {
  name: string;
  sqlType: string;
  notNull: boolean;
  hasDefault: boolean;
  primaryKey: boolean;
  default: string | null;
  enumValues: readonly string[] | undefined;
};

export type CommerceManifestTable = {
  name: string;
  columns: CommerceManifestColumn[];
  indexes: Array<{ name: string; unique: boolean; columns: string[] }>;
  foreignKeys: Array<{ name: string; columns: string[]; foreignTable: string | null }>;
  uniqueConstraints: Array<{ name: string; columns: string[] }>;
};

type MutableTable = Omit<CommerceManifestTable, "columns"> & {
  columns: Map<string, CommerceManifestColumn>;
};

const commerceContractPath = resolve("schema/final-core-commerce.sql");
const expectedContractSha256 = "674f2226bf9006ed9bede4cd3a4338cb605045c9e797a7364c72890ce63e78c2";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function splitTopLevel(value: string): string[] {
  const parts: string[] = [];
  let current = "";
  let depth = 0;
  let quote: string | null = null;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quote) {
      current += character;
      if (character === quote && value[index - 1] !== "\\") quote = null;
      continue;
    }
    if (character === "'" || character === '"' || character === "`") {
      quote = character;
      current += character;
      continue;
    }
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character === "," && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
      continue;
    }
    current += character;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function quotedColumns(value: string): string[] {
  return [...value.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
}

function parseSqlType(definition: string): string {
  let depth = 0;
  let quote: string | null = null;
  let value = "";
  for (let index = 0; index < definition.length; index += 1) {
    const character = definition[index];
    if (quote) {
      value += character;
      if (character === quote && definition[index - 1] !== "\\") quote = null;
      continue;
    }
    if (character === "'" || character === '"') {
      quote = character;
      value += character;
      continue;
    }
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (/\s/.test(character) && depth === 0) break;
    value += character;
  }
  return value.toLowerCase();
}

function parseColumn(definition: string): CommerceManifestColumn | null {
  const match = definition.match(/^`([^`]+)`\s+([\s\S]+)$/);
  if (!match) return null;
  const [, name, remainder] = match;
  const sqlType = parseSqlType(remainder);
  if (!sqlType) return null;
  const enumValues = sqlType.startsWith("enum(")
    ? [...sqlType.matchAll(/'([^']+)'/g)].map((value) => value[1])
    : undefined;
  const defaultMatch = remainder.match(/\bDEFAULT\s+((?:'[^']*')|(?:[^\s,]+))/i);
  return {
    name,
    sqlType,
    // MySQL/MariaDB AUTO_INCREMENT columns are physically NOT NULL even when
    // the recovered DDL omits an explicit NOT NULL token.
    notNull: /\bNOT\s+NULL\b/i.test(remainder) || /\bAUTO_INCREMENT\b/i.test(remainder),
    hasDefault: /\bDEFAULT\b/i.test(remainder) || /\bAUTO_INCREMENT\b/i.test(remainder),
    primaryKey: /\bPRIMARY\s+KEY\b/i.test(remainder),
    default: defaultMatch?.[1] ?? null,
    enumValues,
  };
}

function addIndex(table: MutableTable, name: string, unique: boolean, columns: string[]) {
  if (!table.indexes.some((index) => index.name === name)) {
    table.indexes.push({ name, unique, columns });
  }
  if (unique && name !== "PRIMARY" && !table.uniqueConstraints.some((constraint) => constraint.name === name)) {
    table.uniqueConstraints.push({ name, columns });
  }
}

function parseConstraint(table: MutableTable, statement: string) {
  const foreignKey = statement.match(/(?:CONSTRAINT\s+`([^`]+)`\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s*`([^`]+)`/i);
  if (foreignKey) {
    const name = foreignKey[1] ?? `fk_${table.name}_${table.foreignKeys.length + 1}`;
    if (!table.foreignKeys.some((entry) => entry.name === name)) {
      table.foreignKeys.push({ name, columns: quotedColumns(foreignKey[2]), foreignTable: foreignKey[3] });
    }
    return;
  }
  if (/^PRIMARY\s+KEY/i.test(statement)) {
    const columns = quotedColumns(statement);
    addIndex(table, "PRIMARY", true, columns);
    for (const column of columns) {
      const existing = table.columns.get(column);
      if (existing) existing.primaryKey = true;
    }
    return;
  }
  const index = statement.match(/^(UNIQUE\s+)?KEY\s+`([^`]+)`\s*\(([^)]+)\)/i);
  if (index) addIndex(table, index[2], Boolean(index[1]), quotedColumns(index[3]));
}

function parseCreateTable(contract: string, tables: Map<string, MutableTable>) {
  const createMatcher = /CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?\s+`([^`]+)`\s*\(([\s\S]*?)\)\s*;/gi;
  for (const match of contract.matchAll(createMatcher)) {
    const name = match[1];
    const table: MutableTable = {
      name,
      columns: new Map(),
      indexes: [],
      foreignKeys: [],
      uniqueConstraints: [],
    };
    for (const item of splitTopLevel(match[2])) {
      const column = parseColumn(item);
      if (column) table.columns.set(column.name, column);
      else parseConstraint(table, item);
    }
    tables.set(name, table);
  }
}

function parseAlterTables(contract: string, tables: Map<string, MutableTable>) {
  const alterMatcher = /ALTER\s+TABLE\s+`([^`]+)`\s+([\s\S]*?);/gi;
  for (const match of contract.matchAll(alterMatcher)) {
    const table = tables.get(match[1]);
    if (!table) throw new Error(`Commerce contract alters unknown table: ${match[1]}`);
    for (const itemRaw of splitTopLevel(match[2])) {
      const item = itemRaw.replace(/^ADD\s+/i, "").trim();
      const column = item
        .replace(/^COLUMN\s+/i, "")
        .replace(/^IF\s+NOT\s+EXISTS\s+/i, "");
      const parsedColumn = parseColumn(column);
      if (parsedColumn) {
        table.columns.set(parsedColumn.name, parsedColumn);
        continue;
      }
      parseConstraint(table, item);
      const index = item.match(/^(UNIQUE\s+)?(?:KEY|INDEX)\s+`([^`]+)`\s*\(([^)]+)\)/i);
      if (index) addIndex(table, index[2], Boolean(index[1]), quotedColumns(index[3]));
    }
  }
}

function parseCreateIndexes(contract: string, tables: Map<string, MutableTable>) {
  const matcher = /CREATE\s+(UNIQUE\s+)?INDEX(?:\s+IF\s+NOT\s+EXISTS)?\s+`([^`]+)`\s+ON\s+`([^`]+)`\s*\(([^)]+)\)/gi;
  for (const match of contract.matchAll(matcher)) {
    const table = tables.get(match[3]);
    if (!table) throw new Error(`Commerce contract indexes unknown table: ${match[3]}`);
    addIndex(table, match[2], Boolean(match[1]), quotedColumns(match[4]));
  }
}

export function getFinalCoreCommerceManifestTables(): CommerceManifestTable[] {
  const contract = readFileSync(commerceContractPath, "utf8");
  const actualSha256 = sha256(contract);
  if (actualSha256 !== expectedContractSha256) {
    throw new Error(`Final-Core Commerce contract SHA-256 mismatch: expected ${expectedContractSha256}, got ${actualSha256}.`);
  }

  const tables = new Map<string, MutableTable>();
  parseCreateTable(contract, tables);
  parseAlterTables(contract, tables);
  parseCreateIndexes(contract, tables);

  return [...tables.values()]
    .map((table) => ({
      name: table.name,
      columns: [...table.columns.values()].sort((left, right) => left.name.localeCompare(right.name)),
      indexes: [...table.indexes].sort((left, right) => left.name.localeCompare(right.name)),
      foreignKeys: [...table.foreignKeys].sort((left, right) => left.name.localeCompare(right.name)),
      uniqueConstraints: [...table.uniqueConstraints].sort((left, right) => left.name.localeCompare(right.name)),
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

export const finalCoreCommerceContractMetadata = {
  path: commerceContractPath,
  sha256: expectedContractSha256,
};
