import { describe, expect, it } from "vitest";
import { validateAcademyInviteState } from "./academyRouter";

const now = new Date("2026-08-23T12:00:00.000Z");
const active = {
  acceptedAt: null,
  expiresAt: new Date("2026-08-24T12:00:00.000Z"),
  invitedEmail: "Invited@Example.com",
};

describe("Academy invitation lifecycle", () => {
  it("allows an active invitation to be resent", () => {
    expect(() =>
      validateAcademyInviteState(active, "resend", { now }),
    ).not.toThrow();
  });

  it("rejects resend after acceptance", () => {
    expect(() =>
      validateAcademyInviteState(
        { ...active, acceptedAt: new Date("2026-08-23T11:00:00.000Z") },
        "resend",
        { now },
      ),
    ).toThrow(/cannot be resent/i);
  });

  it("rejects an expired invitation for resend and acceptance", () => {
    const expired = { ...active, expiresAt: now };
    expect(() =>
      validateAcademyInviteState(expired, "resend", { now }),
    ).toThrow(/expired/i);
    expect(() =>
      validateAcademyInviteState(expired, "accept", {
        now,
        accountEmail: "invited@example.com",
      }),
    ).toThrow(/expired/i);
  });

  it("rejects an already-used invitation", () => {
    expect(() =>
      validateAcademyInviteState(
        { ...active, acceptedAt: new Date("2026-08-23T11:00:00.000Z") },
        "accept",
        { now, accountEmail: "invited@example.com" },
      ),
    ).toThrow(/already accepted/i);
  });

  it("matches the signed-in account case-insensitively", () => {
    expect(() =>
      validateAcademyInviteState(active, "accept", {
        now,
        accountEmail: " invited@example.COM ",
      }),
    ).not.toThrow();
  });

  it("rejects the wrong or missing signed-in email", () => {
    expect(() =>
      validateAcademyInviteState(active, "accept", {
        now,
        accountEmail: "other@example.com",
      }),
    ).toThrow(/email address that received/i);
    expect(() => validateAcademyInviteState(active, "accept", { now })).toThrow(
      /email address that received/i,
    );
  });
});
