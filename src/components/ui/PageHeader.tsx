export function PageHeader({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode; }) {
  return (
    <div className="mb-4 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          {desc && <p className="text-sm sm:text-base md:text-lg text-neutral-500 dark:text-gray-400 mt-1 sm:mt-2">{desc}</p>}
        </div>
        {right && <div className="flex-shrink-0">{right}</div>}
      </div>
    </div>
  );
}
