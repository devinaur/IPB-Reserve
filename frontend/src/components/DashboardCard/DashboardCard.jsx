import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, subtitle, icon, iconBgColor }) => {
  return (
    <div className="dashboard-card">
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-value">{value}</p>
        <p className="card-subtitle">{subtitle}</p>
      </div>
      <div className="card-icon" style={{ backgroundColor: iconBgColor }}>
        {icon}
      </div>
    </div>
  );
};

export default DashboardCard;
