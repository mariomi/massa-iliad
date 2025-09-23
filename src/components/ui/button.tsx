import * as React from "react";
import clsx from "clsx";
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline"; };
export function Button({ className, variant="default", ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus:outline-none",
        variant === "default" && "bg-black dark:bg-gray-700 text-white dark:text-white hover:bg-neutral-800 dark:hover:bg-gray-600 px-4 py-2",
        variant === "outline" && "border border-neutral-200 dark:border-gray-600 hover:bg-neutral-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 px-4 py-2",
        className
      )}
      {...props}
    />
  );
}
