import { describe, expect, test } from "vitest";
import {
  buildBusinessSnapshotFromRows,
  selectAuthoritativeProduct,
  type BrandKitSnapshotSource,
  type ProductSnapshotSource,
} from "./marketingBusinessSnapshot";

const brand: BrandKitSnapshotSource = {
  id: 1,
  brandName: "EquiProfile",
  domain: "equiprofile.online",
  tagline: null,
  primaryCta: "Start your free trial",
  secondaryCta: null,
  toneOfVoice: "professional, helpful, premium equestrian software",
  targetAudience: null,
  updatedAt: new Date("2026-06-04T09:23:40.000Z"),
};

const scraped: ProductSnapshotSource = {
  id: 1,
  appName: "EquiProfile",
  category: "equine_stable_management",
  domain: "equiprofile.online",
  landingPageUrl: "https://equiprofile.online/",
  signupUrl: "https://equiprofile.online/",
  targetAudiencesJson: JSON.stringify(["stable owners", "horse owners"]),
  primaryOffer: "Signup or free-trial offer available",
  pricingDetails: null,
  coreFeaturesJson: JSON.stringify([
    "EquiProfile — Professional Horse Management Platform ".repeat(15),
    "horse health records",
  ]),
  benefitsJson: JSON.stringify(["keep stable operations organized"]),
  painPointsSolvedJson: JSON.stringify(["scattered stable admin"]),
  objectionsJson: "[]",
  proofPointsJson: "[]",
  differentiatorsJson: JSON.stringify(["equine and stable management context in one operational platform"]),
  forbiddenClaimsJson: JSON.stringify(["Do not invent customer counts, time savings, revenue gains, or testimonials."]),
  toneOfVoiceJson: JSON.stringify(["professional", "helpful"]),
  ctaLibraryJson: JSON.stringify(["Start your free trial: https://equiprofile.online/"]),
  platformPositioningJson: JSON.stringify({ LinkedIn: "Position operational visibility." }),
  sourceMode: "basic_fetch",
  confidenceScore: 100,
  confirmedAt: null,
  updatedAt: new Date("2026-06-02T13:48:06.000Z"),
};

const confirmed: ProductSnapshotSource = {
  ...scraped,
  id: 2,
  category: "unknown",
  domain: "equiprofile.com",
  primaryOffer: "Start a free EquiProfile trial",
  pricingDetails: "Free-trial details should be confirmed before publishing.",
  coreFeaturesJson: JSON.stringify([
    "horse health records",
    "document tracking",
    "stable management",
    "scheduling",
    "staff visibility",
    "operational growth support",
  ]),
  sourceMode: "manual",
  confidenceScore: 81,
  confirmedAt: new Date("2026-06-03T11:15:43.000Z"),
  updatedAt: new Date("2026-06-04T09:23:40.000Z"),
};

describe("EquiProfile business snapshot export", () => {
  test("prefers the confirmed manual product over the higher-score scrape", () => {
    expect(selectAuthoritativeProduct([scraped, confirmed]).id).toBe(2);
  });

  test("forces canonical brand identity and excludes stale scraped fields", () => {
    const snapshot = buildBusinessSnapshotFromRows("equiprofile", brand, [scraped, confirmed]);
    const product = snapshot.products[0] as Record<string, unknown>;

    expect(snapshot.app).toEqual({
      id: "equiprofile",
      name: "EquiProfile",
      domain: "equiprofile.online",
    });
    expect(product.domain).toBe("equiprofile.online");
    expect(product.landing_page_url).toBe("https://equiprofile.online/");
    expect(product.signup_url).toBe("https://equiprofile.online/");
    expect(product).not.toHaveProperty("brandColors");
    expect(product).not.toHaveProperty("brand_colors");
    expect(JSON.stringify(snapshot)).not.toContain("#0f1d2e");
    expect(JSON.stringify(snapshot)).not.toContain("equiprofile.com");
    expect(JSON.stringify(snapshot)).not.toContain("Professional Horse Management Platform EquiProfile");
  });

  test("does not promote unverified pricing into authoritative pricing data", () => {
    const snapshot = buildBusinessSnapshotFromRows("equiprofile", brand, [confirmed]);
    const product = snapshot.products[0] as Record<string, unknown>;

    expect(snapshot.pricing).toEqual([]);
    expect(snapshot.plans).toEqual([]);
    expect(product.pricing_note).toBe("Free-trial details should be confirmed before publishing.");
    expect(snapshot.authoritative_fields).toEqual(["app", "products", "features", "offers"]);
  });

  test("is deterministic for unchanged canonical facts", () => {
    const first = buildBusinessSnapshotFromRows("equiprofile", brand, [scraped, confirmed]);
    const second = buildBusinessSnapshotFromRows("equiprofile", brand, [confirmed, scraped]);

    expect(second).toEqual(first);
    expect(first.snapshot_id).toMatch(/^equiprofile-business-[a-f0-9]{64}$/);
    expect(first.occurred_at).toBe("2026-06-04T09:23:40.000Z");
  });
});
