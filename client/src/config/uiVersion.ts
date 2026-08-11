/**
 * UI Version Configuration
 *
 * Controls which frontend experience is active (V1 legacy or V2 redesign).
 * The relaunch defaults to V2. V1 remains available only as an explicit
 * deploy-time rollback switch while the relaunch is validated.
 *
 * Set in .env before building:
 *   VITE_UI_VERSION=v2   → redesigned relaunch frontend (default)
 *   VITE_UI_VERSION=v1   → legacy rollback frontend
 */

export type UIVersion = "v1" | "v2";

/** Read the active UI version (deploy-time only). */
export function getUIVersion(): UIVersion {
  const envVersion = import.meta.env.VITE_UI_VERSION;
  if (envVersion === "v1") return "v1";
  return "v2";
}

/** Check if the deployed version is V2. */
export function isV2(): boolean {
  return getUIVersion() === "v2";
}
