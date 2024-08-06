import React, { useEffect } from 'react';
import { CircularProgress, CssBaseline } from '@mui/material';
import { Suspense } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from 'features/auth/model/authSlice';
import AppRoutes from "app/routes";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            <ToastContainer />
        </>
    );
};

export default App;