import React from 'react';
import './Spinner.css';

export const Spinner = () => {
  return (
    <div className="loadingSpinnerContainer">
      <img src="/image/ant.gif" alt="loading" className="loadingAnt" />
    </div>
  );
};


