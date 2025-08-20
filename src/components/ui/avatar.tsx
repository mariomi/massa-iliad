import * as React from "react";
import clsx from "clsx";
export function Avatar({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={clsx("rounded-full bg-neutral-200 grid place-items-center", className)}>{children}</div>;
}
export function AvatarFallback({ children }: { children?: React.ReactNode }) {
  return <span className="text-xs text-neutral-600">{children}</span>;
}
