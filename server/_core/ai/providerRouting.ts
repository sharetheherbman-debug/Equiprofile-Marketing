import type { AIProviderName } from "./types";

export function orderCopywritingProviders(
  _preferredRaw: string,
  isAvailable: (provider: AIProviderName) => boolean,
): AIProviderName[] {
  return isAvailable("genx") ? ["genx"] : [];
}

/**
 * Core production intentionally has one provider implementation. Quality mode
 * may still affect GenX model selection, but never the vendor selection.
 */
export function orderMediaProviders(
  _qualityMode: string,
  isAvailable: (provider: AIProviderName) => boolean,
): AIProviderName[] {
  return isAvailable("genx") ? ["genx"] : [];
}
