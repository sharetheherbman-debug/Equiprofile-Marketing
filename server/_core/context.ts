import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { hasEffectiveManagementAccess } from "../complimentaryAccess";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  hasAccess: boolean; // Whether user has active trial or subscription
};

/**
 * Check Management access through the same canonical resolver used by protected
 * subscription middleware. Billing fields remain authoritative; complimentary
 * access is an overlay that never mutates stored subscription state.
 */
export function checkUserAccess(user: User | null, now: Date = new Date()): boolean {
  return hasEffectiveManagementAccess(user, now);
}

export async function createContext(
  opts: CreateExpressContextOptions,
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    hasAccess: checkUserAccess(user),
  };
}
