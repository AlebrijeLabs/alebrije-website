import React from 'react';

/**
 * Error Display component for showing error messages
 */
export const ErrorDisplay = ({ error, onRetry }) => {
  if (!error) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <h5 className="alert-heading">Error</h5>
      <p>{error.message || 'An unexpected error occurred'}</p>
      {onRetry && (
        <button 
          type="button" 
          className="btn btn-sm btn-outline-danger mt-2" 
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay; 