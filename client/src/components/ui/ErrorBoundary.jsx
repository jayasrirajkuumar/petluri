import React, { Component } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                    <div className="bg-red-50 p-4 rounded-full mb-6">
                        <Icon name="AlertTriangle" size="xl" className="text-red-500" />
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
                    <p className="text-slate-600 mb-6 max-w-md">
                        We apologize for the inconvenience. A critical error has occurred.
                        Please try reloading the page.
                    </p>

                    {/* Dev Mode Error Details */}
                    {process.env.NODE_ENV === 'development' && this.state.error && (
                        <div className="w-full max-w-2xl bg-slate-900 text-slate-50 p-4 rounded-md text-left overflow-auto mb-6 text-xs font-mono">
                            <p className="text-red-300 font-bold mb-2">{this.state.error.toString()}</p>
                            <pre>{this.state.errorInfo?.componentStack}</pre>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <Button onClick={this.handleReload} variant="default">Reload Page</Button>
                        <Button onClick={this.handleGoHome} variant="outline">Go to Home</Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
