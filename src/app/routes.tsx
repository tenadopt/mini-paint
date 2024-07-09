import React, {Suspense, lazy} from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from 'widgets/AppLayout';
import ErrorBoundary from 'shared/model/ErrorBoundary';

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
                path: "signin",
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                    <SignInPage />)
                    </Suspense>
                )
            },
            {
                path: "signup",
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <SignUpPage />)
                    </Suspense>
                )
            },
            {
                path: "feed",
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ImageFeedPage />)
                    </Suspense>
                )
            },
            {
                path: "editor",
                element: (
                    <Suspense fallback={<div>Loading...</div>}>
                        <ImageEditorPage />)
                    </Suspense>
                )
            }
        ]
    }
]);

const AppRoutes = () => (
    <RouterProvider router={router} />
);

export default AppRoutes;
