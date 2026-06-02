import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function AdvancedMarketingDrawer({
  open,
  onOpenChange,
  onOpenSettings,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSettings: () => void;
  children?: ReactNode;
}) {
  return (
    <details className="rounded-3xl border border-stone-200 bg-white p-4 shadow-sm" open={open} onToggle={(event) => onOpenChange(event.currentTarget.open)}>
      <summary className="cursor-pointer text-sm font-semibold text-stone-900">Advanced tools</summary>
      <div className="mt-4 space-y-4 border-t border-stone-100 pt-4">
        <p className="text-xs leading-5 text-stone-600">Brand Kit, Assets, guided creative tools, and Developer Diagnostics stay out of the main campaign flow.</p>
        <Button type="button" variant="outline" size="sm" onClick={onOpenSettings}>Open settings</Button>
        {children}
      </div>
    </details>
  );
}
