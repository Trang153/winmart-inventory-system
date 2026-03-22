import React from "react";
import { Navigate, Outlet, createBrowserRouter, useNavigate } from "react-router-dom";
import { appRoutes, pageRouteMap } from "./routes";
import LoginPage from "../features/auth/pages/LoginPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import SuppliersPage from "../features/suppliers/pages/SuppliersPage";
import AddSupplierPage from "../features/suppliers/pages/AddSupplier";
import ProductsPage from "../features/products/pages/ProductsPage";
import AddProductPage from "../features/products/pages/AddProduct";
import InventoryPage from "../features/inventory/pages/InventoryPage";
import OrdersPage from "../features/orders/pages/OrdersPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import RatingPage from "../features/rating/pages/RatingPage";
import SettingsPage from "../features/settings/pages/SettingsPage";

function ProtectedRoute({ isAuthenticated, currentUser }) {
  if (!isAuthenticated || !currentUser) {
    return <Navigate to={appRoutes.login} replace />;
  }

  return <Outlet />;
}

function RoutedFeaturePage({ Component, currentPage, currentUser, onLogout }) {
  const navigate = useNavigate();

  return (
    <Component
      currentPage={currentPage}
      currentUser={currentUser}
      onLogout={onLogout}
      onNavigate={(page) => {
        const nextRoute = typeof page === "string" && page.startsWith("/")
          ? page
          : (pageRouteMap[page] ?? appRoutes.dashboard);

        navigate(nextRoute);
      }}
    />
  );
}

function LoginRoute({ isAuthenticated, currentUser, onLogin }) {
  const navigate = useNavigate();

  if (isAuthenticated && currentUser) {
    return <Navigate to={appRoutes.dashboard} replace />;
  }

  return (
    <LoginPage
      onLogin={async (credentials) => {
        await onLogin(credentials);
        navigate(appRoutes.dashboard, { replace: true });
      }}
    />
  );
}

export function createAppRouter({ isAuthenticated, currentUser, onLogin, onLogout }) {
  return createBrowserRouter([
    {
      path: "/",
      element: <Navigate to={isAuthenticated && currentUser ? appRoutes.dashboard : appRoutes.login} replace />,
    },
    {
      path: appRoutes.login,
      element: <LoginRoute isAuthenticated={isAuthenticated} currentUser={currentUser} onLogin={onLogin} />,
    },
    {
      element: <ProtectedRoute isAuthenticated={isAuthenticated} currentUser={currentUser} />,
      children: [
        {
          path: appRoutes.dashboard,
          element: <RoutedFeaturePage Component={DashboardPage} currentPage="dashboard" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.suppliers,
          element: <RoutedFeaturePage Component={SuppliersPage} currentPage="suppliers" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.addSupplier,
          element: <RoutedFeaturePage Component={AddSupplierPage} currentPage="suppliers" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.products,
          element: <RoutedFeaturePage Component={ProductsPage} currentPage="products" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.addProduct,
          element: <RoutedFeaturePage Component={AddProductPage} currentPage="products" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.inventory,
          element: <RoutedFeaturePage Component={InventoryPage} currentPage="inventory" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.orders,
          element: <RoutedFeaturePage Component={OrdersPage} currentPage="orders" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.reports,
          element: <RoutedFeaturePage Component={ReportsPage} currentPage="reports" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.rating,
          element: <RoutedFeaturePage Component={RatingPage} currentPage="rating" currentUser={currentUser} onLogout={onLogout} />,
        },
        {
          path: appRoutes.settings,
          element: <RoutedFeaturePage Component={SettingsPage} currentPage="settings" currentUser={currentUser} onLogout={onLogout} />,
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to={isAuthenticated && currentUser ? appRoutes.dashboard : appRoutes.login} replace />,
    },
  ]);
}
