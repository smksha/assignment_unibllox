import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("UI Error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold">Something went wrong</h1>
            <p className="text-gray-600">
              Please Check for Backend Services Running.
            </p>
            <p className="text-gray-600">
              Or Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
