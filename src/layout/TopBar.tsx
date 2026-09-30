import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { FiLogOut, FiSettings, FiSidebar, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";
import { removeUserLocally } from "../api/axios.api";
import { kinds } from "../features/hierarchy/hierarchy";
import { useTree } from "../features/hierarchy/treeState";
import type { CurrentUser } from "../services/admin.service";
import { Button } from "../ui";

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const staticTitles: Record<string, string> = {
  "/": "Обзор",
  "/import": "Импорт из WellPlan",
  "/admin": "Администрирование",
};

/** Breadcrumbs for the open record (from the tree) plus global actions. */
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

  const logout = () => {
    removeUserLocally();
    toast.success("Вы вышли из системы");
    navigate("/auth");
  };

  return (
    <header className="flex h-11 shrink-0 items-center justify-between gap-4 border-b border-ink-200 bg-paper px-4">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleExplorer}
          aria-pressed={explorerOpen}
          title="Проводник (Ctrl/⌘+B)"
          aria-label="Показать или скрыть проводник"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-ink-500 hover:bg-ink-100 hover:text-ink"
        >
          <FiSidebar />
        </button>
        <nav aria-label="Путь" className="min-w-0">
          <ol className="flex items-center gap-1 truncate text-xs text-ink-500">
            <li>
              <Link to="/" className="hover:text-ink">
                Рабочая область
              </Link>
            </li>
            {path.length === 0 &&
              staticTitles[pathname] &&
              pathname !== "/" && (
                <li className="flex items-center gap-1">
                  <span aria-hidden="true">/</span>
                  <span className="text-ink">{staticTitles[pathname]}</span>
                </li>
              )}
            {creating && path.length === 0 && (
              <li className="flex items-center gap-1">
                <span aria-hidden="true">/</span>
                <span className="text-ink">Новая запись</span>
              </li>
            )}
            {path.map((node, i) => (
              <li key={node.id} className="flex min-w-0 items-center gap-1">
                <span aria-hidden="true">/</span>
                {i === path.length - 1 && !creating ? (
                  <span
                    aria-current="page"
                    className="truncate font-medium text-ink"
                  >
                    {node.name || kinds[node.kind].label}
                  </span>
                ) : (
                  <Link
                    to={kinds[node.kind].route(node.id)}
                    className="truncate hover:text-ink"
                    title={kinds[node.kind].label}
                  >
                    {node.name}
                  </Link>
                )}
              </li>
            ))}
            {creating && path.length > 0 && (
              <li className="flex items-center gap-1">
                <span aria-hidden="true">/</span>
                <span className="text-ink">Новая запись</span>
              </li>
            )}
          </ol>
        </nav>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Button
          size="sm"
          variant="ghost"
          icon={<FiUploadCloud />}
          onClick={() => navigate("/import")}
        >
          Импорт
        </Button>
        {user?.role === "admin" && (
          <Button
            size="sm"
            variant="ghost"
            icon={<FiSettings />}
            onClick={() => navigate("/admin")}
          >
            Администрирование
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          icon={<FiLogOut />}
          onClick={logout}
          aria-label="Выйти"
        >
          Выйти
        </Button>
      </div>
    </header>
  );
};
