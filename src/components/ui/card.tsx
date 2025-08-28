import * as React from "react";
import clsx from "clsx";
export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-neutral-200/60 bg-white/70 backdrop-blur shadow-lg",
        className
      )}
      {...props}
    />
  );
}
