import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Connection } from "mysql2/promise";

const commerceContractPath = resolve("schema/final-core-commerce.sql");
const expectedContractSha256 =
  "674f2226bf9006ed9bede4cd3a4338cb605045c9e797a7364c72890ce63e78c2";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function statementsFromContract(contract: string): string[] {
  return contract
    .split(/\n?--> statement-breakpoint\n?/)
    .map((statement) => statement.trim())
    .filter((statement) =>
      /(?:CREATE|ALTER)\s+TABLE|CREATE\s+INDEX/i.test(statement),
    );
}

export function getFinalCoreCommerceContractEvidence() {
  // Git may materialise tracked text as CRLF on Windows. Integrity is defined
  // over the repository's canonical LF content so an unchanged checkout has
  // the same evidence on every supported runner.
  const contract = readFileSync(commerceContractPath, "utf8").replace(
    /\r\n/g,
    "\n",
  );
  const actualSha256 = sha256(contract);
  if (actualSha256 !== expectedContractSha256) {
    throw new Error(
      `Final-Core Commerce contract SHA-256 mismatch: expected ${expectedContractSha256}, got ${actualSha256}.`,
    );
  }

  const statements = statementsFromContract(contract);
  if (!statements.length) {
    throw new Error(
      "Final-Core Commerce contract contains no executable schema statements.",
    );
  }

  return {
    path: commerceContractPath,
    sha256: actualSha256,
    statementCount: statements.length,
    statements,
  };
}

/**
 * Applies the recovered authorized Shop schema only inside an inspector-gated
 * controlled migration command. It is never invoked during normal startup.
 */
export async function applyFinalCoreCommerceContract(connection: Connection) {
  const evidence = getFinalCoreCommerceContractEvidence();
  for (const statement of evidence.statements) {
    await connection.query(statement);
  }
  return {
    path: evidence.path,
    sha256: evidence.sha256,
    statementCount: evidence.statementCount,
  };
}
