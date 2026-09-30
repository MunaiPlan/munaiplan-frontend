import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/HomePage";
import Auth from "../pages/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import CasePage from "../features/case/CasePage";
import AdminPage from "../pages/AdminPage";
import ImportPage from "../pages/ImportPage";
import { EntityPage } from "../features/hierarchy/EntityPage";
import { NewEntityPage } from "../features/hierarchy/NewEntityPage";
import { TrajectoryPage } from "../features/trajectory/TrajectoryPage";
import type { Kind } from "../features/hierarchy/hierarchy";

const protectedRoute = (element: JSX.Element) => <ProtectedRoute>{element}</ProtectedRoute>;

// Simple hierarchy levels share one config-driven page; routes are unchanged from v1.
const entityRoutes: [string, Kind][] = [
    ['fields/:id', 'field'], ['sites/:id', 'site'], ['wells/:id', 'well'],
    ['wellbores/:id', 'wellbore'], ['designs/:id', 'design'],
];

export const createAppRouter = () => createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: protectedRoute(<Home />) },
            { path: 'auth', element: <Auth /> },
            { path: 'import', element: protectedRoute(<ImportPage />) },
            { path: 'admin', element: protectedRoute(<AdminPage />) },
            { path: 'new/:kind', element: protectedRoute(<NewEntityPage />) },
            ...entityRoutes.map(([path, kind]) => ({ path, element: protectedRoute(<EntityPage key={kind} kind={kind} />) })),
            { path: 'trajectories/:id', element: protectedRoute(<TrajectoryPage />) },
            { path: 'cases/:id', element: protectedRoute(<CasePage />) },
            // Companies keep their original top-level route.
            { path: ':id', element: protectedRoute(<EntityPage key="company" kind="company" />) },
        ]
    }
])
