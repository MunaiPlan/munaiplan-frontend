import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home, { companiesLoader } from "../pages/HomePage";
import Catalog from "../pages/Catalog";
import Settings from "../pages/Settings";
import Account from "../pages/Accout";
import Auth from "../pages/Auth";
import ProtectedRoute from "../components/ProtectedRoute";
import CompanyDetail from "../pages/DetailedPages/CompanyDetailPage";
import FieldDetail from "../pages/DetailedPages/FieldDetailPage";
import SiteDetail from "../pages/DetailedPages/SiteDetailPage";
import WellDetail from "../pages/DetailedPages/WellDetailPage";
import WellBoreDetail from "../pages/DetailedPages/WellBoreDetailPage";
import DesignDetail from "../pages/DetailedPages/DesignDetailPage";
import TrajectoryDetail from "../pages/DetailedPages/TrajectoryDetailPage";
import CaseDetail from "../pages/DetailedPages/CaseDetailPage";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                loader: companiesLoader,
                element: (
                    <ProtectedRoute>
                         <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "catalog",
                element: (
                    <ProtectedRoute>
                        <Catalog />
                    </ProtectedRoute>
                ),
            },
            {
                path: "settings",
                element: (
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                ),
            },
            {
                path: "account",
                element: (
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                )
            },
            {
                path: 'auth',
                element: <Auth />,
            },
            {
                loader: companiesLoader,
                path: '/:id',
                element: (
                    <ProtectedRoute>
                        <CompanyDetail />
                    </ProtectedRoute>
                )
            },
            {
                path: 'fields/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <FieldDetail />
                    </ProtectedRoute>
                )
            },
            {
                path: 'sites/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <SiteDetail />
                    </ProtectedRoute>
                )
            },
            {
                path: 'wells/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <WellDetail />
                    </ProtectedRoute>
                )
            },
            {
                path: 'wellbores/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <WellBoreDetail />
                    </ProtectedRoute>
                )
            },
            {
                path: 'designs/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <DesignDetail />
                    </ProtectedRoute>
                )
            },
            {
                path: 'trajectories/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <TrajectoryDetail/>
                    </ProtectedRoute>
                )
            },
            {
                path: 'cases/:id',
                loader: companiesLoader,
                element: (
                    <ProtectedRoute> 
                        <CaseDetail/>
                    </ProtectedRoute>
                )
            }
        ]
    }
])