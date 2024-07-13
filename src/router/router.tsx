import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/HomePage";
import Catalog from "../pages/Catalog";
import Settings from "../pages/Settings";
import Account from "../pages/Accout";
import Auth from "../pages/Auth";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "catalog",
                element: <Catalog />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "account",
                element: <Account />,
            },
            {
                path: 'auth',
                element: <Auth />,
            },
        ]
    }
])