import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const count = (source: string, value: string) => source.split(value).length - 1;

describe("final client-handover frontend contracts", () => {
  it("routes public and authenticated product logos to the correct product homes", () => {
    const management = read("client/src/components/management/ManagementNavbar.tsx");
    const academy = read("client/src/components/academy/AcademyNavbar.tsx");
    const app = read("client/src/components/DashboardLayout.tsx");
    expect(management).toContain('href={isAuthenticated ? "/dashboard" : "/"}');
    expect(academy).toContain('href={isAuthenticated ? dashboardPath : "/academy"}');
    expect(app).toContain('aria-label="EquiProfile Management dashboard"');
  });

  it("shows privacy controls only as a dialog and reopens them from each canonical footer", () => {
    const consent = read("client/src/components/CookieConsent.tsx");
    expect(consent).toContain("OPEN_PRIVACY_CHOICES_EVENT");
    expect(consent).not.toContain("!visible && choice");
    for (const footer of [
      "client/src/components/management/ManagementFooter.tsx",
      "client/src/components/academy/AcademyFooter.tsx",
    ]) {
      expect(read(footer)).toContain("openPrivacyChoices");
    }
  });

  it("lists each product once in the Management footer using full product names", () => {
    const footer = read("client/src/components/management/ManagementFooter.tsx");
    expect(count(footer, "EquiProfile Academy")).toBe(1);
    expect(count(footer, "EquiProfile Shop · Coming Soon")).toBe(1);
    expect(footer).toContain("EquiProfile Management");
    expect(footer).toContain("https://amarktai.co.za");
    expect(footer).not.toContain("amarktai.com");
  });

  it("removes the Management Billing page and all normal Management navigation entries", () => {
    const app = read("client/management/src/ManagementApp.tsx");
    const navigation = read("client/src/components/DashboardLayout.tsx");
    expect(app).not.toContain('path="/billing"');
    expect(app).not.toContain("BillingPage");
    expect(navigation).not.toContain('label: "Billing", path: "/billing"');
  });

  it("uses one Management mobile navigation system while keeping all modules discoverable", () => {
    const navigation = read("client/src/components/DashboardLayout.tsx");
    expect(navigation).toContain('{!isMobile && <div className="relative" ref={sidebarRef}>');
    expect(count(navigation, 'aria-label="Mobile navigation"')).toBe(1);
    expect(navigation).toContain("moreModuleGroups");
  });

  it("keeps the Academy build isolated from Management and Stable routes", () => {
    const academy = read("client/academy/src/AcademyApp.tsx");
    expect(academy).toContain("AcademyProtectedRoute");
    for (const route of ["/horses", "/health", "/training", "/stable", "/ai-chat", "/admin"]) {
      expect(academy).not.toContain(`path="${route}"`);
    }
  });

  it("keeps Shop noindex and free of commerce routes", () => {
    const html = read("client/shop/index.html");
    const app = read("client/shop/src/ShopApp.tsx");
    expect(html).toMatch(/noindex/i);
    expect(app).not.toMatch(/cart|checkout|inventory|subscription/i);
  });
});
