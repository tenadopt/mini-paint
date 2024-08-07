import React, { useEffect } from 'react';
import { CircularProgress, CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from 'features/auth/model/authSlice';
import AppRoutes from "app/routes";

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    return (
        <>
            <CssBaseline />
            <Suspense fallback={<CircularProgress />}>
                <AppRoutes />
            </Suspense>
        </>
    );
};

export default App;