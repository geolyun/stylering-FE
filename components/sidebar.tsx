export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 rounded-card border border-gray-200 bg-gray-50 p-3 lg:block">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Sidebar
      </div>
      <ul className="space-y-1 text-sm text-gray-700">
        <li className="rounded-xl bg-white px-2 py-1.5">New Chat</li>
        <li className="rounded-xl px-2 py-1.5 hover:bg-white">History</li>
      </ul>
    </aside>
  );
}
