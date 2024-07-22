import React, { Suspense, lazy, ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from 'shared/model/ErrorBoundary';
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector } from 'shared/hooks/hooks';
import AppLayout from "widgets/AppLayout";

const HomePage = lazy(() => import('pages/Home/ui/HomePage'));
const SignInPage = lazy(() => import('pages/SignIn/ui/SignInPage'));
const SignUpPage = lazy(() => import('pages/SignUp/ui/SignUpPage'));
const ImageFeedPage = lazy(() => import('pages/ImageFeed/ui/ImageFeedPage'));
const ImageEditorPage = lazy(() => import('pages/ImageEditor/ui/ImageEditorPage'));
const WorkPage = lazy(() => import('pages/Work/ui/WorkPage'));

interface RequireAuthProps {
    children: ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const auth = useAppSelector((state) => state.auth);
    const location = useLocation();

    if (!auth.userId) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

const PublicLayout: React.FC = () => {
    const auth = useAppSelector((state) => state.auth);

    return auth.userId ? <Navigate to="/feed" replace /> : (
        <AppLayout>
            <Outlet />
        </AppLayout>
    );
};

const AuthenticatedLayout: React.FC = () => (
    <RequireAuth>
        <AppLayout>
            <Outlet />
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
                element: (
                    <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: "signin",
                element: (
                    <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                        <SignInPage />
                    </Suspense>
                ),
            },
            {
                path: "signup",
                element: (
                    <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                        <SignUpPage />
                    </Suspense>
                ),
            },
        ]
    },
    {
        element: <AuthenticatedLayout />,
        children: [
            {
                path: "feed",
                element: (
                    <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                        <ImageFeedPage />
                    </Suspense>
                ),
            },
            {
                path: "editor",
                element: (
                    <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                        <ImageEditorPage />
                    </Suspense>
                ),
            },
            {
                path: "editor/:workId",
                element: (
                    <Suspense fallback={<Box display="flex" justifyContent="center" alignItems="center" height="100vh"><CircularProgress /></Box>}>
                        <WorkPage />
                    </Suspense>
                ),
            }
        ]
    }
]);

const AppRoutes = () => (
    <RouterProvider router={router} />
);

export default AppRoutes;