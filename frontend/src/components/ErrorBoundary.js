import React from 'react';

// catches errors so the whole page doesn't go blank
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    // starts off with no error
    this.state = { hasError: false, error: null };
  }

  // runs when something breaks, remembers that it broke
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // prints the error to the console so we can see what happened
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    // if something broke, show this message instead of the app
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }

    // nothing broke, show the app like normal
    return this.props.children;
  }
}

export default ErrorBoundary;