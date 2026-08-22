import { describe, expect, it } from "vitest";
import { orderCopywritingProviders, orderMediaProviders } from "./providerRouting";

describe("Core GenX-only provider routing", () => {
  it("uses GenX even when a legacy copywriting preference is configured", () => {
    const order = orderCopywritingProviders("qwen", (provider) => provider !== "huggingface");
    expect(order).toEqual(["genx"]);
  });

  it("returns no provider when GenX is unavailable instead of falling back", () => {
    const order = orderCopywritingProviders("huggingface", (provider) => provider === "qwen");
    expect(order).toEqual([]);
  });

  it("keeps media generation on GenX for every quality mode", () => {
    expect(orderMediaProviders("standard", (provider) => provider !== "huggingface")).toEqual(["genx"]);
    expect(orderMediaProviders("elite", (provider) => provider === "qwen")).toEqual([]);
  });
});
