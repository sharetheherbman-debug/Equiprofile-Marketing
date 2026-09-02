export type EquiProfileProduct = "management" | "academy" | "marketing" | "shop";

export type ProductComplimentaryGrant = {
  version: 1;
  product: EquiProfileProduct;
  tier: string;
  startsAt: string;
  endsAt: string | null;
  grantedByUserId?: number;
  reason?: string;
  note?: string;
};

export type ProductEntitlementPreferences = Record<string, unknown> & {
  productComplimentaryAccess?: Partial<
    Record<EquiProfileProduct, ProductComplimentaryGrant | null>
  >;
};

const PRODUCT_SET = new Set<EquiProfileProduct>([
  "management",
  "academy",
  "marketing",
  "shop",
]);

function parsePreferences(
  raw: string | Record<string, unknown> | null | undefined,
): ProductEntitlementPreferences {
  if (!raw) return {};
  if (typeof raw === "object" && !Array.isArray(raw)) {
    return raw as ProductEntitlementPreferences;
  }
  if (typeof raw !== "string") return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as ProductEntitlementPreferences)
      : {};
  } catch {
    return {};
  }
}

export function readProductComplimentaryGrant(
  raw: string | Record<string, unknown> | null | undefined,
  product: EquiProfileProduct,
): ProductComplimentaryGrant | null {
  const preferences = parsePreferences(raw);
  const candidate = preferences.productComplimentaryAccess?.[product];
  if (!candidate || candidate.version !== 1 || candidate.product !== product) {
    return null;
  }
  if (!PRODUCT_SET.has(candidate.product)) return null;
  const startsAt = new Date(candidate.startsAt);
  if (!Number.isFinite(startsAt.getTime())) return null;
  if (candidate.endsAt !== null) {
    const endsAt = new Date(candidate.endsAt);
    if (!Number.isFinite(endsAt.getTime())) return null;
  }
  return candidate;
}

export function isProductComplimentaryActive(
  raw: string | Record<string, unknown> | null | undefined,
  product: EquiProfileProduct,
  now: Date = new Date(),
): boolean {
  const grant = readProductComplimentaryGrant(raw, product);
  if (!grant) return false;
  if (new Date(grant.startsAt).getTime() > now.getTime()) return false;
  return grant.endsAt === null || new Date(grant.endsAt).getTime() > now.getTime();
}

export function grantProductComplimentaryAccess(
  raw: string | Record<string, unknown> | null | undefined,
  input: {
    product: EquiProfileProduct;
    tier: string;
    days?: number | null;
    grantedByUserId?: number;
    reason?: string;
    note?: string;
    now?: Date;
  },
): ProductEntitlementPreferences {
  const preferences = parsePreferences(raw);
  const now = input.now ?? new Date();
  if (input.days !== undefined && input.days !== null) {
    if (!Number.isInteger(input.days) || input.days < 1 || input.days > 3650) {
      throw new Error("Complimentary access days must be an integer from 1 to 3650");
    }
  }
  const endsAt =
    input.days === undefined || input.days === null
      ? null
      : new Date(now.getTime() + input.days * 86_400_000).toISOString();
  const grant: ProductComplimentaryGrant = {
    version: 1,
    product: input.product,
    tier: input.tier.trim() || "full",
    startsAt: now.toISOString(),
    endsAt,
    ...(input.grantedByUserId
      ? { grantedByUserId: input.grantedByUserId }
      : {}),
    ...(input.reason?.trim() ? { reason: input.reason.trim() } : {}),
    ...(input.note?.trim() ? { note: input.note.trim() } : {}),
  };
  return {
    ...preferences,
    productComplimentaryAccess: {
      ...(preferences.productComplimentaryAccess ?? {}),
      [input.product]: grant,
    },
  };
}

export function revokeProductComplimentaryAccess(
  raw: string | Record<string, unknown> | null | undefined,
  product: EquiProfileProduct,
): ProductEntitlementPreferences {
  const preferences = parsePreferences(raw);
  return {
    ...preferences,
    productComplimentaryAccess: {
      ...(preferences.productComplimentaryAccess ?? {}),
      [product]: null,
    },
  };
}

export function listProductComplimentaryAccess(
  raw: string | Record<string, unknown> | null | undefined,
) {
  const preferences = parsePreferences(raw);
  return (["management", "academy", "marketing", "shop"] as const).map(
    (product) => {
      const grant = readProductComplimentaryGrant(preferences, product);
      return {
        product,
        grant,
        active: isProductComplimentaryActive(preferences, product),
      };
    },
  );
}
