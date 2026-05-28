"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const COLORS = ["#b91c1c", "#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fecaca"]
const COLORS_MULTI = ["#b91c1c", "#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#06b6d4"]

// Custom tooltip style
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="chart-tooltip-value" style={{ color: entry.color }}>
            {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Bar Chart Component
export function SimpleBarChart({ data, dataKey, xKey = "name", color = "#b91c1c", height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// Multi-Bar Chart Component
export function MultiBarChart({ data, dataKeys, xKey = "name", colors = COLORS_MULTI, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {dataKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

// Line Chart Component
export function SimpleLineChart({ data, dataKey, xKey = "name", color = "#b91c1c", height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ fill: color }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// Multi-Line Chart Component
export function MultiLineChart({ data, dataKeys, xKey = "name", colors = COLORS_MULTI, height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line key={key} type="monotone" dataKey={key} stroke={colors[index % colors.length]} strokeWidth={2} dot={{ fill: colors[index % colors.length] }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

// Area Chart Component
export function SimpleAreaChart({ data, dataKey, xKey = "name", color = "#b91c1c", height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}20`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

// Pie Chart Component
export function SimplePieChart({ data, dataKey = "value", nameKey = "name", colors = COLORS, height = 300, showLabel = true }) {
  const renderLabel = ({ name, percent }) => showLabel ? `${name}: ${(percent * 100).toFixed(0)}%` : null
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={renderLabel}
          labelLine={showLabel}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

// Donut Chart with center text
export function DonutChart({ data, dataKey = "value", nameKey = "name", colors = COLORS, height = 300, centerText = "", centerSubtext = "" }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        {centerText && (
          <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="chart-center-text">
            {centerText}
          </text>
        )}
        {centerSubtext && (
          <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" className="chart-center-subtext">
            {centerSubtext}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  )
}

// Horizontal Bar Chart
export function HorizontalBarChart({ data, dataKey, xKey = "name", color = "#b91c1c", height = 300 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis type="category" dataKey={xKey} tick={{ fontSize: 12, fill: "#6b7280" }} width={70} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey={dataKey} fill={color} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
