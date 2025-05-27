/**
 * Error types for the Alebrije wallet
 */
export const ErrorTypes = {
  CONNECTION: 'CONNECTION_ERROR',
  TRANSACTION: 'TRANSACTION_ERROR',
  CONTRACT: 'CONTRACT_ERROR',
  WALLET: 'WALLET_ERROR',
  NETWORK: 'NETWORK_ERROR',
  USER: 'USER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Custom error class for Alebrije wallet
 */
export class AlebrijeError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, originalError = null) {
    super(message);
    this.name = 'AlebrijeError';
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date();
  }
  
  /**
   * Get a user-friendly error message
   */
  getUserMessage() {
    switch (this.type) {
      case ErrorTypes.CONNECTION:
        return 'Failed to connect to the network. Please check your internet connection and try again.';
      
      case ErrorTypes.TRANSACTION:
        return 'Transaction failed. This could be due to insufficient funds or network congestion.';
      
      case ErrorTypes.CONTRACT:
        return 'Smart contract interaction failed. The operation could not be completed.';
      
      case ErrorTypes.WALLET:
        return 'Wallet error. Please make sure your wallet is properly set up and try again.';
      
      case ErrorTypes.NETWORK:
        return 'Network error. Please check if you are connected to the correct blockchain network.';
      
      case ErrorTypes.USER:
        return this.message; // For user errors, show the actual message
      
      default:
        return 'An unexpected error occurred. Please try again later.';
    }
  }
  
  /**
   * Get technical details for logging
   */
  getTechnicalDetails() {
    return {
      type: this.type,
      message: this.message,
      originalError: this.originalError ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : null,
      timestamp: this.timestamp
    };
  }
}

/**
 * Error handler for wallet operations
 */
export const handleWalletError = (error, defaultMessage = 'Operation failed') => {
  console.error('Wallet error:', error);
  
  // If it's already an AlebrijeError, return it
  if (error instanceof AlebrijeError) {
    return error;
  }
  
  // Determine error type based on message or code
  let errorType = ErrorTypes.UNKNOWN;
  let errorMessage = defaultMessage;
  
  // Handle Web3 and Ethereum provider errors
  if (error.code) {
    switch (error.code) {
      case 4001:
        // User rejected the request
        errorType = ErrorTypes.USER;
        errorMessage = 'Request was rejected by the user';
        break;
      
      case -32602:
        // Invalid parameters
        errorType = ErrorTypes.USER;
        errorMessage = 'Invalid transaction parameters';
        break;
      
      case -32603:
        // Internal error
        errorType = ErrorTypes.WALLET;
        errorMessage = 'Wallet internal error';
        break;
      
      case -32000:
      case -32001:
      case -32002:
      case -32003:
        // RPC errors
        errorType = ErrorTypes.NETWORK;
        errorMessage = 'Network communication error';
        break;
    }
  }
  
  // Check for common error messages
  const errorString = error.message ? error.message.toLowerCase() : '';
  
  if (errorString.includes('insufficient funds')) {
    errorType = ErrorTypes.USER;
    errorMessage = 'Insufficient funds for this transaction';
  } else if (errorString.includes('gas')) {
    errorType = ErrorTypes.TRANSACTION;
    errorMessage = 'Gas estimation failed or gas limit exceeded';
  } else if (errorString.includes('nonce')) {
    errorType = ErrorTypes.TRANSACTION;
    errorMessage = 'Transaction nonce error. Try resetting your wallet.';
  } else if (errorString.includes('rejected') || errorString.includes('denied')) {
    errorType = ErrorTypes.USER;
    errorMessage = 'Transaction was rejected';
  } else if (errorString.includes('network') || errorString.includes('connection')) {
    errorType = ErrorTypes.CONNECTION;
    errorMessage = 'Network connection error';
  } else if (errorString.includes('timeout')) {
    errorType = ErrorTypes.CONNECTION;
    errorMessage = 'Request timed out. The network may be congested.';
  }
  
  return new AlebrijeError(errorMessage, errorType, error);
};

/**
 * Error boundary component for React
 */
export const withErrorBoundary = (WrappedComponent, fallbackUI) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Component error:', error, errorInfo);
      // You could also log to an error reporting service here
    }

    render() {
      if (this.state.hasError) {
        const error = this.state.error instanceof AlebrijeError 
          ? this.state.error 
          : new AlebrijeError('Component error', ErrorTypes.UNKNOWN, this.state.error);
        
        return fallbackUI ? fallbackUI(error) : (
          <div className="error-boundary">
            <h3>Something went wrong</h3>
            <p>{error.getUserMessage()}</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>
              Try Again
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}; 