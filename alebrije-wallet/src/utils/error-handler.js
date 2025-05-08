/**
 * Error types for the application
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK',
  WALLET: 'WALLET',
  USER: 'USER',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Custom error class for Alebrije Wallet
 */
export class AlebrijeError extends Error {
  constructor(message, type = ErrorTypes.UNKNOWN, originalError = null) {
    super(message);
    this.name = 'AlebrijeError';
    this.type = type;
    this.originalError = originalError;
  }
}

/**
 * Handle and transform errors from various sources
 * @param {Error} error - Original error object
 * @param {string} message - Custom message for the error
 * @returns {AlebrijeError} - Transformed error
 */
export const handleError = (error, message = '') => {
  console.error('Error:', error);
  
  // If it's already an AlebrijeError, just return it
  if (error instanceof AlebrijeError) {
    return error;
  }
  
  // Determine error type
  let errorType = ErrorTypes.UNKNOWN;
  
  // Check for network errors
  if (error.message && (
    error.message.includes('Network') ||
    error.message.includes('timeout') ||
    error.message.includes('connection')
  )) {
    errorType = ErrorTypes.NETWORK;
  }
  
  // Check for wallet-related errors
  else if (error.message && (
    error.message.includes('wallet') ||
    error.message.includes('account') ||
    error.message.includes('signature')
  )) {
    errorType = ErrorTypes.WALLET;
  }
  
  // Create new error with context
  const finalMessage = message ? `${message}: ${error.message}` : error.message;
  return new AlebrijeError(finalMessage, errorType, error);
};

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
    errorType = ErrorTypes.NETWORK;
    errorMessage = 'Network connection error';
  } else if (errorString.includes('timeout')) {
    errorType = ErrorTypes.NETWORK;
    errorMessage = 'Request timed out. The network may be congested.';
  }
  
  return new AlebrijeError(errorMessage, errorType, error);
}; 