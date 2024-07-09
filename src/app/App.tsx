import React from 'react';
import AppRoutes from 'app/routes';
import { CssBaseline } from '@mui/material';
import {Suspense} from "react";

const App = () => (
    <>
        <CssBaseline />
        <Suspense fallback={<div>Loading...</div>}>
            <AppRoutes />
        </Suspense>
    </>
);

export default App;