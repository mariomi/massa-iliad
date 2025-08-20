export function PageHeader({ title, desc, right }: { title: string; desc?: string; right?: React.ReactNode; }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">{title}</h1>
          {desc && <p className="text-sm text-neutral-500">{desc}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
