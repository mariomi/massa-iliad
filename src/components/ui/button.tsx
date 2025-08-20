import * as React from "react";
import clsx from "clsx";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline"; };
export function Button({ className, variant="default", ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none",
        variant === "default" && "bg-black text-white hover:bg-neutral-800 px-4 py-2",
        variant === "outline" && "border border-neutral-200 hover:bg-neutral-50 px-4 py-2",
        className
      )}
      {...props}
    />
  );
}
