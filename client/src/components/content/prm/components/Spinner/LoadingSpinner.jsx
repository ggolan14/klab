import React from 'react';

const LoadingSpinner = ({ size = 32, className = '' }) => {
    return (
        <>
            <style>{`
        .loading-spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-top: 4px solid #555;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
            <div
                className={`loading-spinner ${className}`}
                style={{ width: size, height: size }}
                role="status"
                aria-label="Loading"
            />
        </>
    );
};

export default LoadingSpinner;
