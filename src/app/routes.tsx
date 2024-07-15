import React, {Suspense, lazy} from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from 'widgets/AppLayout';
import ErrorBoundary from 'shared/model/ErrorBoundary';
import {Box, CircularProgress} from "@mui/material";

const HomePage = lazy(()=>import('pages/Home/ui/HomePage'));
const SignInPage = lazy(()=>import('pages/SignIn/ui/SignInPage'));
const SignUpPage = lazy(()=>import('pages/SignUp/ui/SignUpPage'));
const ImageFeedPage = lazy(()=>import('pages/ImageFeed/ui/ImageFeedPage'));
const ImageEditorPage = lazy(()=>import('pages/ImageEditor/ui/ImageEditorPage'));

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
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
            }
        ]
    }
]);

const AppRoutes = () => (
    <RouterProvider router={router} />
);

export default AppRoutes;
