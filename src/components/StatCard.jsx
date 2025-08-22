const StatCard = ({ title, value, change, icon: Icon, color = 'primary' }) => {
  const formatValue = (val) => {
    if (typeof val === 'number') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(val);
    }
    return val;
  };

  return (
    <div className={`stat-card card fade-in glow`}>
      <div className="card-body">
        <div className="stat-header">
          <div className={`stat-icon stat-icon-${color}`}>
            <Icon size={28} />
          </div>
          {change && (
            <div className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
              {change > 0 ? '+' : ''}{change}%
            </div>
          )}
        </div>
        
        <div className="stat-content">
          <h3 className="stat-value">{formatValue(value)}</h3>
          <p className="stat-title gradient-text">{title}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;