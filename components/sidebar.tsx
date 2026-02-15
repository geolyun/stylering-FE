export function Sidebar() {
  return (
    <aside className="hidden w-56 shrink-0 rounded-[20px] border border-gray-200 bg-gray-50 p-3 lg:block">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Workspace
      </div>
      <button
        type="button"
        className="mb-3 w-full rounded-2xl bg-black px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-gray-800"
      >
        + New Chat
      </button>
      <ul className="space-y-1 text-sm text-gray-700">
        <li className="cursor-pointer rounded-2xl bg-white px-3 py-2 transition hover:bg-gray-100">
          Product Sync
        </li>
        <li className="cursor-pointer rounded-2xl px-3 py-2 transition hover:bg-white">
          Spring API Test
        </li>
        <li className="cursor-pointer rounded-2xl px-3 py-2 transition hover:bg-white">
          Profile Debug
        </li>
      </ul>
    </aside>
  );
}
