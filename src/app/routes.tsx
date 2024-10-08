import React, { Suspense, lazy, ReactNode } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import ErrorBoundary from "shared/model/ErrorBoundary";
import { CircularProgress } from "@mui/material";
import { useAppSelector } from "shared/hooks/hooks";
import AppLayout from "widgets/AppLayout";

const HomePage = lazy(() => import("pages/Home/ui/HomePage"));
const SignInPage = lazy(() => import("pages/SignIn/ui/SignInPage"));
const SignUpPage = lazy(() => import("pages/SignUp/ui/SignUpPage"));
const ImageFeedPage = lazy(() => import("pages/ImageFeed/ui/ImageFeedPage"));
const ImageEditorPage = lazy(
  () => import("pages/ImageEditor/ui/ImageEditorPage"),
);

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const auth = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!auth.userId) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicLayout = () => {
  const auth = useAppSelector((state) => state.auth);

  if (auth.userId) return <Navigate to="/feed" replace />;

  return (
    <AppLayout>
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  );
};

const AuthenticatedLayout = () => (
  <RequireAuth>
    <AppLayout>
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </AppLayout>
  </RequireAuth>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Navigate to="homepage" replace />,
      },
      {
        path: "homepage",
        element: <HomePage />,
      },
      {
        path: "signin",
        element: <SignInPage />,
      },
      {
        path: "signup",
        element: <SignUpPage />,
      },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: "feed",
        element: <ImageFeedPage />,
      },
      {
        path: "editor",
        element: <ImageEditorPage />,
      },
      {
        path: "editor/:workId",
        element: <ImageEditorPage />,
      },
    ],
  },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
