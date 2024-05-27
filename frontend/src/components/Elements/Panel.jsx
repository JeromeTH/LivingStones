import React from 'react';
import './Panel.css';

const Panel= ({ show, children }) => {
  return (
    <div className="panel-overlay">
      <div className="panel">
        {children}
      </div>
    </div>
  );
};

export default Panel;
