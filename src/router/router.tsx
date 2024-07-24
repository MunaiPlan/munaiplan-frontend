import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/HomePage";
import Catalog from "../pages/Catalog";
import Settings from "../pages/Settings";
import Account from "../pages/Accout";
import Auth from "../pages/Auth";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
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
        ]
    }
])