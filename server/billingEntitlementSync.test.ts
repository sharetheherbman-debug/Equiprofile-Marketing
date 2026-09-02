import crypto from "crypto";
import { describe, expect, it } from "vitest";
import { canonicalizeBillingBody, verifyBillingSyncSignature } from "./billingEntitlementSync";

const key = "b".repeat(48);
const body = {
  event_id: "evt_sync_123",
  external_user_id: 17,
  product: "academy",
  status: "active",
  plan: "academy_rider",
  interval: "monthly",
};

function signature(timestamp: string, nonce: string) {
  return crypto.createHmac("sha256", key)
    .update(`${timestamp}\n${nonce}\n${canonicalizeBillingBody(body)}`, "utf8")
    .digest("hex");
}

describe("Billing to Core entitlement synchronization", () => {
  it("accepts a valid canonical HMAC within the short skew window", () => {
    const timestamp = "1788285600";
    const nonce = "nonce_1234567890abcdef";
    expect(verifyBillingSyncSignature({
      body,
      timestamp,
      nonce,
      signature: signature(timestamp, nonce),
      applicationId: "equiprofile",
      expectedApplicationId: "equiprofile",
      connectorKey: key,
      nowSeconds: 1788285600,
    })).toEqual({ ok: true });
  });

  it("rejects expired timestamps, altered payloads and another application", () => {
    const timestamp = "1788285000";
    const nonce = "nonce_1234567890abcdef";
    const signed = signature(timestamp, nonce);
    expect(verifyBillingSyncSignature({ body, timestamp, nonce, signature: signed, applicationId: "equiprofile", expectedApplicationId: "equiprofile", connectorKey: key, nowSeconds: 1788285600 })).toMatchObject({ ok: false, reason: "expired_timestamp" });
    expect(verifyBillingSyncSignature({ body: { ...body, product: "management" }, timestamp: "1788285600", nonce, signature: signature("1788285600", nonce), applicationId: "equiprofile", expectedApplicationId: "equiprofile", connectorKey: key, nowSeconds: 1788285600 })).toMatchObject({ ok: false, reason: "invalid_signature" });
    expect(verifyBillingSyncSignature({ body, timestamp: "1788285600", nonce, signature: signature("1788285600", nonce), applicationId: "another-app", expectedApplicationId: "equiprofile", connectorKey: key, nowSeconds: 1788285600 })).toMatchObject({ ok: false, reason: "invalid_application" });
  });
});
