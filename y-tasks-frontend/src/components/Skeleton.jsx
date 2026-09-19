export default function Skeleton() {
  return (
    <ul>
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i} className="flex items-center gap-3.5 border-b border-line py-3.5 last:border-b-0">
          <div className="skeleton h-[22px] w-[22px] shrink-0 rounded-full" />
          <div className="skeleton h-[13px] rounded" style={{ width: `${45 + ((i * 13) % 40)}%` }} />
        </li>
      ))}
    </ul>
  );
}
