export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  onClick
}) {
  return (
    <div 
      className={`stat-card ${variant === "primary" ? "primary" : ""}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer', transition: 'transform 0.2s' } : {}}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div className="stat-card-content">
        <div className="stat-card-info">
          <p className="stat-card-label">{title}</p>
          <p className="stat-card-value">{value}</p>
          {description && (
            <p className="stat-card-desc">{description}</p>
          )}
          {trend && (
            <p className={`stat-card-trend ${trend.value >= 0 ? "positive" : "negative"}`}>
              {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="stat-card-icon">
          <Icon />
        </div>
      </div>
    </div>
  )
}
