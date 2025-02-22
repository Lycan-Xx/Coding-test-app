import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Enhanced error logging
    console.error('Error caught by boundary:', {
      error: error?.toString(),
      componentStack: errorInfo?.componentStack,
      message: error?.message,
      name: error?.name,
      stack: error?.stack
    });

    this.setState({
      error,
      errorInfo
    });

    // Add a global handler for uncaught errors
    window.addEventListener('error', (event) => {
      console.error('Global error caught:', {
        error: event?.error,
        message: event?.message,
        filename: event?.filename,
        lineno: event?.lineno,
        colno: event?.colno
      });
    });

    // Handle ResizeObserver errors specifically
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message?.includes('ResizeObserver')) {
        event.preventDefault();
        console.warn('ResizeObserver error handled:', event.reason);
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-500 rounded-md bg-red-50 dark:bg-red-900/10">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">Something went wrong</h2>
          <p className="mt-2 text-sm text-red-500 dark:text-red-300">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {this.state.errorInfo?.componentStack && (
            <pre className="mt-2 text-xs text-red-400 dark:text-red-300 overflow-auto">
              {this.state.errorInfo.componentStack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;