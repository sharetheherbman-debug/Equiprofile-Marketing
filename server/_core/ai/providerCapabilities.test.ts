import { describe, expect, it } from "vitest";
import {
  categoryForTask,
  getProviderCapabilityRegistry,
  rankProvidersForCapability,
  resolveProviderSelectionForTask,
} from "./providerCapabilities";

describe("providerCapabilities", () => {
  it("maps tasks to capability categories", () => {
    expect(categoryForTask("copywriting")).toBe("copywriting");
    expect(categoryForTask("text_to_video")).toBe("text_to_video");
  });

  it("exposes GenX as the only copywriting provider", async () => {
    const ranked = await rankProvidersForCapability("copywriting");
    expect(ranked).toEqual(["genx"]);
  });

  it("resolves provider selection without vendor fallback", async () => {
    const selection = await resolveProviderSelectionForTask("text_to_image");
    expect(selection.primaryProvider).toBe("genx");
    expect(selection.fallbackProviders).toEqual([]);
  });

  it("builds full provider registry with capability scores", async () => {
    const registry = await getProviderCapabilityRegistry();
    expect(registry.genx.capabilities.reasoning).toBeGreaterThan(0.5);
    expect(registry.genx.capabilities.image_generation).toBeGreaterThan(0);
  });
});
