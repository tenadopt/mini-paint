import React, { Component, ReactNode } from 'react';

// Define the interface for the props
interface ErrorBoundaryProps {
    children: ReactNode;
}

// Define the interface for the state
interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): ErrorBoundaryState {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // You can log the error to an error reporting service
        console.error("Error Boundary Caught an error", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            // Can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;