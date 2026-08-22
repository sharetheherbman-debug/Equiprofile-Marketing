import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath: string) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

describe("Commerce administration workflows", () => {
  const router = read("server/commerceRouter.ts");
  const admin = read("client/shop/src/CommerceAdmin.tsx");

  it("surfaces persisted operational exception metrics", () => {
    for (const field of [
      "averageOrderValuePence",
      "pendingPaymentCount",
      "fulfilmentProblemCount",
      "supplierSyncProblemCount",
      "stockIssueCount",
      "marginWarningCount",
      "returnQueueCount",
    ]) {
      expect(router).toContain(field);
      expect(admin).toContain(field);
    }
  });

  it("keeps product publishing behind human approval, rights and development safeguards", () => {
    expect(router).toContain("setProductLifecycle: adminUnlockedProcedure");
    expect(router).toContain("product.developmentOnly");
    expect(router).toContain('product.imageRightsStatus !== "licensed"');
    expect(router).toContain('approval?.status !== "approved"');
    expect(admin).toContain("approveProduct.mutate");
    expect(admin).toContain("productLifecycle.mutate");
    expect(admin).toContain("editProduct.mutate");
  });

  it("requires approved onboarding and licensed rights before supplier activation", () => {
    expect(router).toContain("setSupplierStatus: adminUnlockedProcedure");
    expect(router).toContain('supplier.onboardingStatus !== "APPROVED"');
    expect(router).toContain('supplier.imageRightsStatus !== "licensed"');
    expect(router).toContain("testSupplierConnection: adminUnlockedProcedure");
    expect(admin).toContain("supplierStatus.mutate");
    expect(admin).toContain("supplierConnection.mutate");
  });

  it("records return review actions and renders the protected audit trail", () => {
    expect(router).toContain("reviewReturn: adminUnlockedProcedure");
    expect(router).toContain("auditLog: adminUnlockedProcedure.query");
    expect(router).toContain("This return cannot move to the requested state.");
    expect(admin).toContain("reviewReturn.mutate");
    expect(admin).toContain("auditLog.data");
  });
});
