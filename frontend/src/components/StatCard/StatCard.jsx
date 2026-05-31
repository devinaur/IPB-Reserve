import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
      <div className={`stat-icon-wrapper ${colorClass}`}>
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
