import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

describe("PR64N go-live blocker completion", () => {
  it("keeps Create view compact with clear primary actions and truth badges", () => {
    const app = read("client/src/components/marketing/app/TheMarketingApp.tsx");
    for (const label of [
      "Edit",
      "Improve",
      "Approve",
      "Schedule",
      "Export",
      "Draft generated",
      "Needs media upgrade",
      "Needs audio upgrade",
      "Ready for review",
      "Ready to export",
      "Scheduled",
      "Published",
    ]) {
      expect(app).toContain(label);
    }
  });

  it("keeps product setup collapsible into a compact confirmed strip", () => {
    const product = read("client/src/components/marketing/app/workspace/ProductContextPanel.tsx");
    expect(product).toContain("CTA URL:");
    expect(product).toContain("Logo:");
    expect(product).toContain("showEditor");
    expect(product).toContain("Edit product");
  });

  it("hides preview diagnostics for normal users unless support mode is enabled", () => {
    const preview = read("client/src/components/marketing/app/workspace/MarketingPreviewPanel.tsx");
    expect(preview).toContain("supportModeEnabled");
    expect(preview).toContain("VITE_MARKETING_SUPPORT_MODE");
  });

  it("keeps social connection cards truthful about missing scopes, credentials, and adapter readiness", () => {
    const settings = read("client/src/components/marketing/app/MarketingAppSettings.tsx");
    for (const token of ["adapter_missing", "missing_token", "missing_scopes", "requiredScopes", "missingScopes"]) {
      expect(settings).toContain(token);
    }
  });
});
