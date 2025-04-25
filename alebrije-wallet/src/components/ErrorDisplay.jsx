import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { AlebrijeError, ErrorTypes } from '../utils/error-handler';

const ErrorDisplay = ({ error, onDismiss, onRetry }) => {
  if (!error) return null;
  
  // Convert to AlebrijeError if it's not already
  const alebrijeError = error instanceof AlebrijeError 
    ? error 
    : new AlebrijeError(error.message || 'An error occurred', ErrorTypes.UNKNOWN, error);
  
  // Determine severity based on error type
  let variant = 'danger';
  if (alebrijeError.type === ErrorTypes.USER) {
    variant = 'warning';
  } else if (alebrijeError.type === ErrorTypes.CONNECTION || alebrijeError.type === ErrorTypes.NETWORK) {
    variant = 'info';
  }
  
  return (
    <Alert variant={variant} className="error-display">
      <Alert.Heading>
        {alebrijeError.type === ErrorTypes.USER ? 'Action Required' : 'Error'}
      </Alert.Heading>
      <p>{alebrijeError.getUserMessage()}</p>
      
      <div className="d-flex justify-content-end">
        {onDismiss && (
          <Button 
            variant="outline-secondary" 
            size="sm" 
            onClick={onDismiss}
            className="me-2"
          >
            Dismiss
          </Button>
        )}
        
        {onRetry && alebrijeError.type !== ErrorTypes.USER && (
          <Button 
            variant="outline-primary" 
            size="sm" 
            onClick={onRetry}
          >
            Retry
          </Button>
        )}
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2">
          <summary className="text-muted">Technical Details</summary>
          <pre className="mt-2 p-2 bg-light">
            {JSON.stringify(alebrijeError.getTechnicalDetails(), null, 2)}
          </pre>
        </details>
      )}
    </Alert>
  );
};

export default ErrorDisplay; 