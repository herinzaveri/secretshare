type StatsProps = {
  readCount: number;
  writeCount: number;
}

const Stats = ({readCount, writeCount}: StatsProps) => {
  const stats = [
    {
      label: 'Messages Shared',
      value: writeCount,
    },
    {
      label: 'Messages Revealed',
      value: readCount,
    },
  ] satisfies { label: string; value: number }[];

  return (
    <section className="container mx-auto">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
        {stats.map(({label, value}) => (
          <li
            key={label}
            className="flex items-center justify-between gap-2 px-4 py-3 overflow-hidden rounded m sm:flex-col"
          >
            <dd className="text-2xl font-bold tracking-tight text-center sm:text-5xl text-zinc-200">
              {Intl.NumberFormat('en-US', {notation: 'compact'}).format(value)}
            </dd>
            <dt className="leading-6 text-center text-zinc-500">{label}</dt>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Stats;
