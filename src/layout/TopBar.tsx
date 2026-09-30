import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FiLogOut,
  FiMoreVertical,
  FiSettings,
  FiSidebar,
  FiUploadCloud,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { removeUserLocally } from "../api/axios.api";
import { kinds } from "../features/hierarchy/hierarchy";
import { useTree } from "../features/hierarchy/treeState";
import type { CurrentUser } from "../services/admin.service";
import { Button, cn } from "../ui";

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const staticTitles: Record<string, string> = {
  "/": "Обзор",
  "/import": "Импорт из WellPlan",
  "/admin": "Администрирование",
};

interface Crumb {
  key: string;
  label: string;
  /** Link target; the current page has none. */
  to?: string;
  title?: string;
}

/**
 * Breadcrumbs for the open record (from the tree) plus global actions.
 * Phones show only the current page with a "…" link to its parent; wider screens show the root,
 * "…", the parent and the current page (the whole path from 1536px). On phones the actions move into
 * a menu. Tablets show the actions as icons.
 */
export const TopBar = ({
  user,
  explorerOpen,
  onToggleExplorer,
}: {
  user: CurrentUser | null;
  explorerOpen: boolean;
  onToggleExplorer: () => void;
}) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { pathTo } = useTree();
  const creating = pathname.startsWith("/new/");
  // While creating, show the parent's path followed by "new record".
  const path = pathTo(
    creating ? (params.get("parent") ?? undefined) : pathname.match(UUID)?.[0],
  );

  const crumbs: Crumb[] = [{ key: "root", label: "Рабочая область", to: "/" }];
  if (path.length === 0 && staticTitles[pathname] && pathname !== "/") {
    crumbs.push({ key: "page", label: staticTitles[pathname] });
  }
  path.forEach((node, i) => {
    const current = i === path.length - 1 && !creating;
    crumbs.push({
      key: node.id,
      label: current ? node.name || kinds[node.kind].label : node.name,
      to: current ? undefined : kinds[node.kind].route(node.id),
      title: kinds[node.kind].label,
    });
  });
  if (creating) crumbs.push({ key: "new", label: "Новая запись" });
  const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : undefined;

  const logout = () => {
    removeUserLocally();
    toast.success("Вы вышли из системы");
    navigate("/auth");
  };

  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-ink-200 bg-paper px-2 touch:h-12 md:gap-4 md:px-4">
      <div className="flex min-w-0 items-center gap-1 md:gap-2">
        <button
          type="button"
          onClick={onToggleExplorer}
          aria-expanded={explorerOpen}
          aria-controls="explorer"
          title="Проводник (Ctrl/⌘+B)"
          aria-label="Показать или скрыть проводник"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-500 hover:bg-ink-100 hover:text-ink touch:h-11 touch:w-11"
        >
          <FiSidebar className="touch:h-5 touch:w-5" />
        </button>
        <nav aria-label="Путь" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-1 text-sm text-ink-500 md:text-xs">
            {parent?.to && (
              <li className="flex shrink-0 md:hidden">
                <Link
                  to={parent.to}
                  aria-label={`Назад: ${parent.label}`}
                  title={parent.label}
                  className="flex h-11 items-center px-1.5 hover:text-ink"
                >
                  …
                </Link>
              </li>
            )}
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1;
              const middle = i > 0 && i < crumbs.length - 2;
              // Hidden crumbs stay readable by screen readers (sr-only), only the visual trail is shortened.
              const visibility = last
                ? "flex"
                : middle
                  ? "sr-only 2xl:not-sr-only 2xl:flex"
                  : "sr-only md:not-sr-only md:flex";
              return (
                <Fragment key={c.key}>
                  {middle && i === 1 && (
                    <li
                      aria-hidden="true"
                      className="hidden shrink-0 items-center gap-1 md:flex 2xl:hidden"
                    >
                      <span>/</span>
                      <span
                        title={crumbs
                          .slice(1, -2)
                          .map((m) => m.label)
                          .join(" / ")}
                      >
                        …
                      </span>
                    </li>
                  )}
                  <li
                    className={cn(
                      "min-w-0 items-center gap-1",
                      visibility,
                      i === 0 && !last && "shrink-0",
                    )}
                  >
                    {i > 0 && <span aria-hidden="true">/</span>}
                    {c.to && !last ? (
                      <Link
                        to={c.to}
                        title={c.title}
                        className="max-w-[12rem] truncate hover:text-ink"
                      >
                        {c.label}
                      </Link>
                    ) : (
                      <span
                        aria-current="page"
                        title={c.label}
                        className={cn(
                          "truncate text-ink",
                          c.key !== "page" && c.key !== "new" && "font-medium",
                        )}
                      >
                        {c.label}
                      </span>
                    )}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Tablets and desktops: the actions stay in the bar (icons only below 1024px). */}
      <div className="hidden shrink-0 items-center gap-1.5 md:flex">
        <Button
          size="sm"
          variant="ghost"
          icon={<FiUploadCloud />}
          onClick={() => navigate("/import")}
          aria-label="Импорт"
          title="Импорт из WellPlan"
        >
          <span className="hidden lg:inline">Импорт</span>
        </Button>
        {user?.role === "admin" && (
          <Button
            size="sm"
            variant="ghost"
            icon={<FiSettings />}
            onClick={() => navigate("/admin")}
            aria-label="Администрирование"
            title="Администрирование"
          >
            <span className="hidden lg:inline">Администрирование</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          icon={<FiLogOut />}
          onClick={logout}
          aria-label="Выйти"
          title="Выйти"
        >
          <span className="hidden lg:inline">Выйти</span>
        </Button>
      </div>

      {/* Phones: one overflow menu. */}
      <OverflowMenu>
        {user && (
          <div
            role="none"
            className="border-b border-ink-200 px-4 pb-2 pt-1.5 text-xs text-ink-500"
          >
            <p className="truncate text-ink">{user.email}</p>
            {user.role === "admin" && <p>администратор</p>}
          </div>
        )}
        <MenuItem icon={<FiUploadCloud />} onSelect={() => navigate("/import")}>
          Импорт
        </MenuItem>
        {user?.role === "admin" && (
          <MenuItem icon={<FiSettings />} onSelect={() => navigate("/admin")}>
            Администрирование
          </MenuItem>
        )}
        <MenuItem icon={<FiLogOut />} onSelect={logout}>
          Выйти
        </MenuItem>
      </OverflowMenu>
    </header>
  );
};

/** "⋮" button with a dropdown menu; phones only. Arrow keys move, Escape closes. */
const OverflowMenu = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const items = () => [
    ...(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []),
  ];

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    items()[0]?.focus();
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (!menu.current?.contains(target) && !button.current?.contains(target))
        setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent) => {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      button.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      list[(index + step + list.length) % list.length]?.focus();
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div className="relative shrink-0 md:hidden">
      <button
        ref={button}
        type="button"
        aria-label="Меню"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded text-ink-500 hover:bg-ink-100 hover:text-ink"
      >
        <FiMoreVertical className="h-5 w-5" />
      </button>
      {open && (
        // Clicks on items bubble up here, so choosing any item closes the menu.
        <div
          ref={menu}
          role="menu"
          aria-label="Меню"
          onKeyDown={onKeyDown}
          onClick={() => setOpen(false)}
          className="absolute right-0 top-full z-50 mt-1 w-64 max-w-[calc(100vw-1rem)] overflow-hidden rounded-md border border-ink-200 bg-paper py-1 shadow-pop"
        >
          {children}
        </div>
      )}
    </div>
  );
};

const MenuItem = ({
  icon,
  onSelect,
  children,
}: {
  icon: ReactNode;
  onSelect: () => void;
  children: ReactNode;
}) => (
  <button
    type="button"
    role="menuitem"
    tabIndex={-1}
    onClick={onSelect}
    className="flex h-11 w-full items-center gap-3 px-4 text-left text-sm text-ink hover:bg-ink hover:text-paper focus:bg-ink focus:text-paper focus:outline-none"
  >
    <span aria-hidden="true" className="text-base">
      {icon}
    </span>
    {children}
  </button>
);
