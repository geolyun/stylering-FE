interface SidebarProps {
  onNewChat?: () => void;
}

export function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <aside className="hidden w-56 shrink-0 rounded-[20px] border border-gray-200 bg-gray-50 p-3 lg:block">
      <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Workspace
      </div>
      <button
        type="button"
        onClick={onNewChat}
        className="w-full rounded-2xl bg-black px-3 py-2 text-left text-sm font-medium text-white transition hover:bg-gray-800"
      >
        + New Chat
      </button>
    </aside>
  );
}
