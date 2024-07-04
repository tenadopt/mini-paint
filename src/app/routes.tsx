import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ImageEditorPage from 'pages/ImageEditor/ui/ImageEditorPage';
import AppLayout from 'widgets/AppLayout';

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<AppLayout />}>
            <Route path="editor" element={<ImageEditorPage />} />
        </Route>
    </Routes>
);

export default AppRoutes;
