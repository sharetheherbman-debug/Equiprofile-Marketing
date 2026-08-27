import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getDbMock: vi.fn(),
}));

vi.mock("../../db", () => ({
  getDb: mocks.getDbMock,
}));

import { getRuntimeConfig, getRuntimeConfigMode } from "../../dynamicConfig";
import { getProviderTelemetrySummary, recordProviderTelemetry } from "./providerTelemetry";

const originalRuntimeConfigMode = process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE;
const originalGenXApiKey = process.env.GENX_API_KEY;

describe("provider unit-test isolation", () => {
  beforeEach(() => {
    process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE = "unit_test_mock";
    mocks.getDbMock.mockReset();
  });

  afterEach(() => {
    if (originalRuntimeConfigMode === undefined) {
      delete process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE;
    } else {
      process.env.EQUIPROFILE_RUNTIME_CONFIG_MODE = originalRuntimeConfigMode;
    }

    if (originalGenXApiKey === undefined) {
      delete process.env.GENX_API_KEY;
    } else {
      process.env.GENX_API_KEY = originalGenXApiKey;
    }
  });

  it("keeps runtime config in unit_test_mock mode and avoids DB lookup", async () => {
    process.env.GENX_API_KEY = "env-only-key";
    const value = await getRuntimeConfig("genx_api_key", "GENX_API_KEY");

    expect(getRuntimeConfigMode()).toBe("unit_test_mock");
    expect(value).toBe("env-only-key");
    expect(mocks.getDbMock).not.toHaveBeenCalled();
  });

  it("skips telemetry DB writes/reads in unit_test_mock mode", async () => {
    await recordProviderTelemetry({
      provider: "genx",
      model: "kling-v2.5-turbo",
      task: "text_to_video",
      tenantId: "global",
      success: true,
    });
    const rows = await getProviderTelemetrySummary({ task: "text_to_video" });

    expect(rows).toEqual([]);
    expect(mocks.getDbMock).not.toHaveBeenCalled();
  });
});
