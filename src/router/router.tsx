import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import IndexPage from "../pages/IndexPage";
import Auth from "../pages/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminPage from "../pages/AdminPage";
import ImportPage from "../pages/ImportPage";
import { EntityPage } from "../features/hierarchy/EntityPage";
import { NewEntityPage } from "../features/hierarchy/NewEntityPage";
import type { Kind } from "../features/hierarchy/hierarchy";

const protectedRoute = (element: JSX.Element) => <ProtectedRoute>{element}</ProtectedRoute>;

// Simple hierarchy levels share one config-driven page; routes are unchanged from v1.
const entityRoutes: [string, Kind][] = [
    ['fields/:id', 'field'], ['sites/:id', 'site'], ['wells/:id', 'well'],
    ['wellbores/:id', 'wellbore'], ['designs/:id', 'design'],
];

export const createAppRouter = () => createBrowserRouter([
    // The public user manual: its own layout and a separate lazily loaded chunk, signed in or out.
    { path: '/docs/:slug?', errorElement: <ErrorPage />, lazy: async () => {
        const { DocsApp } = await import("../features/docs/DocsApp");
        return { element: <DocsApp /> };
    } },
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            // Visitors get the landing page, signed-in users the overview.
            { index: true, element: <IndexPage /> },
            { path: 'auth', element: <Auth /> },
            { path: 'import', element: protectedRoute(<ImportPage />) },
            { path: 'admin', element: protectedRoute(<AdminPage />) },
            { path: 'new/:kind', element: protectedRoute(<NewEntityPage />) },
            ...entityRoutes.map(([path, kind]) => ({ path, element: protectedRoute(<EntityPage key={kind} kind={kind} />) })),
            // The chart pages load on demand, so the landing and sign-in pages stay light.
            { path: 'trajectories/:id', lazy: async () => {
                const { TrajectoryPage } = await import("../features/trajectory/TrajectoryPage");
                return { element: protectedRoute(<TrajectoryPage />) };
            } },
            { path: 'cases/:id', lazy: async () => {
                const { default: CasePage } = await import("../features/case/CasePage");
                return { element: protectedRoute(<CasePage />) };
            } },
            // Companies keep their original top-level route.
            { path: ':id', element: protectedRoute(<EntityPage key="company" kind="company" />) },
        ]
    }
])
