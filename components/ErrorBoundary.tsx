import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Replaced public class field initialization with a constructor.
  // This is a more compatible way to define state in class components and resolves
  // the TypeScript errors where `this.props` and `this.setState` were not found.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-red-100 dark:bg-red-900/20 border border-red-500 rounded-lg">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">Something went wrong.</h1>
            <p className="text-red-800 dark:text-red-300 mb-4">An error occurred in this section of the application.</p>
            <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-red-500 text-white font-bold px-6 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
                Try Again
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
