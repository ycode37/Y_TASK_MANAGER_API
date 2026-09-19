import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTaskStore } from "../store/useTaskStore";
import QuickAdd from "./QuickAdd";
import Toolbar from "./Toolbar";
import TaskRow from "./TaskRow";
import Pagination from "./Pagination";
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const {
    tasks,
    page,
    totalPages,
    status,
    sort,
    search,
    loading,
    initialized,
    fetchTasks,
    setPage,
    setStatus,
    setSort,
    setSearch,
    addTask,
    toggleDone,
    renameTask,
    deleteTask,
  } = useTaskStore();

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstName = user?.name?.split(" ")[0] || "";

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[640px] px-6 pb-20 pt-10 sm:pt-16">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-ink text-[13px] font-semibold text-paper">
            Y.
          </div>
          <span className="font-display text-[19px] text-ink">Tasks</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-[14px] text-ink-soft sm:inline">Hi, {firstName}</span>
          <button
            type="button"
            onClick={logout}
            aria-label="Log out"
            className="flex items-center gap-1.5 rounded p-1.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-rust"
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </div>
      </header>

      <QuickAdd onAdd={addTask} />

      <Toolbar
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        onSearchChange={setSearch}
      />

      <div className="min-h-[240px]">
        {!initialized && loading ? (
          <Skeleton />
        ) : tasks.length === 0 ? (
          <EmptyState filtered={status !== "all" || Boolean(search)} />
        ) : (
          <motion.ul layout>
            <AnimatePresence initial={false}>
              {tasks.map((task) => (
                <TaskRow
                  key={task._id}
                  task={task}
                  onToggle={toggleDone}
                  onRename={renameTask}
                  onDelete={deleteTask}
                />
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
