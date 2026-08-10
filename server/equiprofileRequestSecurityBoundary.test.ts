import { afterEach, describe, expect, it } from "vitest";
import type { Request } from "express";
import { COOKIE_NAME } from "@shared/const";
import { isTrustedCookieWrite } from "./_core/requestSecurity";

const originalNodeEnv = process.env.NODE_ENV;
const originalBaseUrl = process.env.BASE_URL;
const originalTrustedOrigins = process.env.EQUIPROFILE_TRUSTED_ORIGINS;

function request(input: {
  method?: string;
  origin?: string;
  cookie?: string;
}): Request {
  return {
    method: input.method ?? "POST",
    headers: {
      origin: input.origin,
      cookie: input.cookie,
    },
  } as Request;
}

function sessionCookie() {
  return `${COOKIE_NAME}=test-token`;
}

afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
  process.env.BASE_URL = originalBaseUrl;
  process.env.EQUIPROFILE_TRUSTED_ORIGINS = originalTrustedOrigins;
});

describe("EquiProfile same-origin cookie write policy", () => {
  it("allows the production EquiProfile origin for authenticated writes", () => {
    process.env.NODE_ENV = "production";
    process.env.BASE_URL = "https://equiprofile.online";
    process.env.EQUIPROFILE_TRUSTED_ORIGINS =
      "https://equiprofile.online,https://www.equiprofile.online";

    expect(
      isTrustedCookieWrite(
        request({
          origin: "https://equiprofile.online",
          cookie: sessionCookie(),
        }),
      ),
    ).toBe(true);
  });

  it("rejects a cross-site authenticated write", () => {
    process.env.NODE_ENV = "production";
    process.env.BASE_URL = "https://equiprofile.online";
    process.env.EQUIPROFILE_TRUSTED_ORIGINS =
      "https://equiprofile.online,https://www.equiprofile.online";

    expect(
      isTrustedCookieWrite(
        request({
          origin: "https://attacker.example",
          cookie: sessionCookie(),
        }),
      ),
    ).toBe(false);
  });

  it("rejects an authenticated unsafe request with no Origin header", () => {
    process.env.NODE_ENV = "production";
    process.env.BASE_URL = "https://equiprofile.online";

    expect(
      isTrustedCookieWrite(
        request({ cookie: sessionCookie() }),
      ),
    ).toBe(false);
  });

  it("does not block unauthenticated login/signup style requests", () => {
    process.env.NODE_ENV = "production";
    process.env.BASE_URL = "https://equiprofile.online";

    expect(
      isTrustedCookieWrite(
        request({ origin: "https://attacker.example" }),
      ),
    ).toBe(true);
  });
});
