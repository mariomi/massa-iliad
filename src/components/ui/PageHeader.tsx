export function PageHeader({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode; }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
          {desc && <p className="text-lg text-neutral-500 dark:text-gray-400 mt-2">{desc}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
