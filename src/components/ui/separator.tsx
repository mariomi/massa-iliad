export function Separator({ orientation = "horizontal", className = "" }: { orientation?: "horizontal" | "vertical"; className?: string; }) {
  return <div className={(orientation === "horizontal" ? "w-full h-px" : "h-full w-px") + " bg-neutral-200 " + className} />;
}
