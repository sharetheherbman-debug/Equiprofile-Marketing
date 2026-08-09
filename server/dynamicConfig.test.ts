import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const selectRows = vi.fn();
  const fromSpy = vi.fn(() => ({
    where: async () => selectRows(),
  }));
  const getDbMock = vi.fn(async () => ({
    select: () => ({
      from: fromSpy,
    }),
  }));
  return { selectRows, fromSpy, getDbMock };
});

vi.mock("./db", () => ({
  getDb: mocks.getDbMock,
}));

import {
  getRuntimeConfig,
  getRuntimeConfigMode,
  invalidateConfigCache,
} from "./dynamicConfig";
import { siteSettings } from "../drizzle/schema";

describe("dynamicConfig source policy", () => {
  beforeEach(() => {
    mocks.selectRows.mockReset();
    mocks.fromSpy.mockClear();
    mocks.getDbMock.mockClear();
    invalidateConfigCache();
    delete process.env.GENX_API_KEY;
    delete process.env.SITE_NAME;
    delete process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE;
  });

  it("uses the VPS environment and skips database reads for GenX secrets", async () => {
    process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE = "production_live";
    process.env.GENX_API_KEY = "env-genx";
    mocks.selectRows.mockResolvedValueOnce([{ value: "db-genx" }]);

    const value = await getRuntimeConfig("genx_api_key", "GENX_API_KEY");

    expect(value).toBe("env-genx");
    expect(mocks.getDbMock).not.toHaveBeenCalled();
    expect(mocks.fromSpy).not.toHaveBeenCalled();
    expect(mocks.selectRows).not.toHaveBeenCalled();
  });

  it("still permits database-first lookup for ordinary non-secret settings", async () => {
    process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE = "production_live";
    process.env.SITE_NAME = "Environment name";
    mocks.selectRows.mockResolvedValueOnce([{ value: "Database name" }]);

    const value = await getRuntimeConfig("site_name", "SITE_NAME");

    expect(value).toBe("Database name");
    expect(mocks.fromSpy).toHaveBeenCalledWith(siteSettings);
    expect(mocks.selectRows).toHaveBeenCalled();
  });

  it("uses unit_test_mock mode and skips DB reads for environment-only keys", async () => {
    process.env.GENX_API_KEY = "env-genx";

    const value = await getRuntimeConfig("genx_api_key", "GENX_API_KEY");

    expect(value).toBe("env-genx");
    expect(getRuntimeConfigMode()).toBe("unit_test_mock");
    expect(mocks.getDbMock).not.toHaveBeenCalled();
    expect(mocks.fromSpy).not.toHaveBeenCalled();
  });
});
