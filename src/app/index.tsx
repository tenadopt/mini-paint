import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from 'app/store';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');

const queryClient = new QueryClient();

if (container) {
    const root = createRoot(container);

    root.render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <App />
                <ReactQueryDevtools initialIsOpen={false} />
                <ToastContainer autoClose={3000} hideProgressBar />
            </Provider>
        </QueryClientProvider>
    );
} else {
    toast.error('Root element not found');
}