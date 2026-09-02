import { readFileSync, readdirSync, statSync } from "fs";
import { extname, join, resolve } from "path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

function sourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const target = join(directory, name);
    if (name === "node_modules" || name === "dist") return [];
    return statSync(target).isDirectory()
      ? sourceFiles(target)
      : [".ts", ".tsx", ".js", ".jsx"].includes(extname(target)) ? [target] : [];
  });
}

describe("client handoff public contract", () => {
  it("contains no customer-facing demo offer in either Core frontend", () => {
    const offenders = sourceFiles(resolve(root, "client"))
      .filter((file) => !/\.test\.[jt]sx?$/.test(file))
      .flatMap((file) => /\b(?:book|schedule|request)\s+(?:a\s+)?demo\b|\bdemo\s+call\b|\bdemo\b/i.test(readFileSync(file, "utf8")) ? [file] : []);
    expect(offenders).toEqual([]);
  });

  it("keeps public utilities off authenticated product shells", () => {
    for (const app of ["client/management/src/ManagementApp.tsx", "client/academy/src/AcademyApp.tsx"]) {
      const source = read(app);
      expect(source).not.toContain("SalesChatWidget");
      expect(source).not.toContain("PWAInstallPrompt");
      expect(source).toContain("CookieConsent");
    }
  });

  it("keeps Shop deferred and links the Management footer to both products", () => {
    const shop = read("client/shop/src/ShopApp.tsx");
    const footer = read("client/src/components/management/ManagementFooter.tsx");
    expect(shop).toContain("Coming soon");
    expect(shop).not.toMatch(/checkout|add to cart|product catalogue/i);
    expect(footer).toContain("https://academy.equiprofile.online/academy");
    expect(footer).toContain("https://shop.equiprofile.online");
  });

  it("keeps Core execution GenX-only with no runtime fallback", () => {
    const registry = read("server/_core/ai/providers/providerRegistry.ts");
    const tasks = read("server/_core/ai/tasks/taskRegistry.ts");
    const router = read("server/routers.ts");
    expect(registry).not.toMatch(/executeHuggingFaceTask|executeQwenTask/);
    expect(registry).toContain('provider !== "genx"');
    expect(tasks).not.toMatch(/fallbackProviders:\s*\[(?!\])/);
    expect(router).toContain('message: "Core AI is GenX-only."');
  });

  it("routes Academy customer billing through the standalone service", () => {
    const dashboard = read("client/src/pages/AcademyDashboard.tsx");
    const academyRouter = read("server/academyRouter.ts");
    expect(dashboard).toContain('setLocation("/billing")');
    expect(dashboard).not.toContain("createBillingPortal");
    expect(academyRouter).not.toContain("createBillingCheckout:");
    expect(academyRouter).not.toContain("createBillingPortal:");
  });
});
