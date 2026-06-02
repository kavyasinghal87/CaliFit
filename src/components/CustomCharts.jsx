import React, { useState } from 'react';

/**
 * Circular Progress Ring Component
 */
export function ProgressRing({ 
  percentage = 70, 
  size = 180, 
  strokeWidth = 14, 
  color = 'var(--emerald)',
  glow = true,
  children
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, percentage)) / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          stroke="var(--bg-tertiary)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Foreground filled path */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ 
            strokeDashoffset, 
            transition: 'stroke-dashoffset 0.8s ease-in-out',
            strokeLinecap: 'round',
            filter: glow ? `drop-shadow(0 0 4px ${color})` : 'none'
          }}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Central content overlay */}
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Custom SVG Area Chart Component (Weekly Calorie Tracking)
 */
export function CustomAreaChart({ data = [], height = 220 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>;

  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const width = 500; // Reference internal coordinate space
  
  // Find min/max values
  const yValues = data.map(d => d.value);
  const maxY = Math.max(...yValues, 2500) * 1.1; // Default upper bound
  const minY = 0;

  // Coordinate mapping helper
  const getX = (index) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const getY = (value) => padding.top + (1 - (value - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

  // Generate smooth area path
  let points = [];
  for (let i = 0; i < data.length; i++) {
    points.push(`${getX(i)},${getY(data[i].value)}`);
  }

  const linePath = points.length > 0 ? `M ${points.join(' L ')}` : '';
  const areaPath = points.length > 0 
    ? `${linePath} L ${getX(data.length - 1)},${height - padding.bottom} L ${getX(0)},${height - padding.bottom} Z`
    : '';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--emerald)" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Axis Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const val = Math.round(minY + (maxY - minY) * ratio);
          const y = getY(val);
          return (
            <g key={idx}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={width - padding.right} 
                y2={y} 
                stroke="var(--card-border)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding.left - 8} 
                y={y + 4} 
                fill="var(--text-secondary)" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {areaPath && <path d={areaPath} fill="url(#areaGlow)" />}

        {/* Line stroke */}
        {linePath && (
          <path 
            d={linePath} 
            fill="none" 
            stroke="var(--emerald)" 
            strokeWidth="3" 
            style={{ filter: 'drop-shadow(0 2px 6px rgba(255,106,0,0.3))' }}
          />
        )}

        {/* X Axis Labels */}
        {data.map((item, idx) => {
          const x = getX(idx);
          return (
            <text 
              key={idx} 
              x={x} 
              y={height - 10} 
              fill="var(--text-secondary)" 
              fontSize="11" 
              textAnchor="middle"
            >
              {item.label}
            </text>
          );
        })}

        {/* Dots and interactive hover triggers */}
        {data.map((item, idx) => {
          const x = getX(idx);
          const y = getY(item.value);
          const isHovered = hoveredIdx === idx;
          
          return (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
              {/* Invisible touch target */}
              <circle cx={x} cy={y} r="14" fill="transparent" style={{ cursor: 'pointer' }} />
              {/* Visible dot */}
              <circle 
                cx={x} 
                cy={y} 
                r={isHovered ? 6 : 4} 
                fill={isHovered ? 'var(--lime)' : 'var(--emerald)'} 
                stroke="var(--bg-secondary)" 
                strokeWidth="2"
                style={{ transition: 'all 0.15s ease' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {hoveredIdx !== null && (
        <div style={{
          position: 'absolute',
          left: `${(getX(hoveredIdx) / width) * 100}%`,
          top: `${(getY(data[hoveredIdx].value) / height) * 100 - 45}%`,
          transform: 'translateX(-50%)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--emerald)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          pointerEvents: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 10,
          whiteSpace: 'nowrap'
        }}>
          <div>{data[hoveredIdx].label}</div>
          <div style={{ color: 'var(--emerald)', fontWeight: 'bold' }}>{data[hoveredIdx].value} kcal</div>
        </div>
      )}
    </div>
  );
}

/**
 * Custom SVG Bar Chart Component (Workout Consistency / Active Minutes)
 */
export function CustomBarChart({ data = [], height = 220 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>;

  const padding = { top: 20, right: 15, bottom: 30, left: 40 };
  const width = 500;
  
  const yValues = data.map(d => d.value);
  const maxY = Math.max(...yValues, 60) * 1.1;
  const minY = 0;

  const getX = (index) => padding.left + (index / data.length) * (width - padding.left - padding.right);
  const getY = (value) => padding.top + (1 - (value - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);
  
  const barWidth = Math.max(16, ((width - padding.left - padding.right) / data.length) * 0.5);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        {/* Y Axis Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const val = Math.round(minY + (maxY - minY) * ratio);
          const y = getY(val);
          return (
            <g key={idx}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={width - padding.right} 
                y2={y} 
                stroke="var(--card-border)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding.left - 8} 
                y={y + 4} 
                fill="var(--text-secondary)" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {val}m
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((item, idx) => {
          const x = getX(idx) + ((width - padding.left - padding.right) / data.length - barWidth) / 2;
          const y = getY(item.value);
          const barHeight = height - padding.bottom - y;
          const isHovered = hoveredIdx === idx;

          return (
            <g 
              key={idx} 
              onMouseEnter={() => setHoveredIdx(idx)} 
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              {/* Hover effect container */}
              <rect
                x={x - 4}
                y={padding.top}
                width={barWidth + 8}
                height={height - padding.top - padding.bottom}
                fill="transparent"
              />
              {/* Actual bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 4)} // minimum visual indicator for 0
                rx="4"
                fill={isHovered ? 'var(--lime)' : 'var(--emerald)'}
                opacity={isHovered ? 1 : 0.85}
                style={{ 
                  transition: 'all 0.15s ease',
                  filter: isHovered ? 'drop-shadow(0 0 6px var(--lime))' : 'none'
                }}
              />
            </g>
          );
        })}

        {/* X Axis Labels */}
        {data.map((item, idx) => {
          const x = getX(idx) + ((width - padding.left - padding.right) / data.length) / 2;
          return (
            <text 
              key={idx} 
              x={x} 
              y={height - 10} 
              fill="var(--text-secondary)" 
              fontSize="11" 
              textAnchor="middle"
            >
              {item.label}
            </text>
          );
        })}
      </svg>

      {/* Floating tooltip */}
      {hoveredIdx !== null && (
        <div style={{
          position: 'absolute',
          left: `${((getX(hoveredIdx) + ((width - padding.left - padding.right) / data.length) / 2) / width) * 100}%`,
          top: `${(getY(data[hoveredIdx].value) / height) * 100 - 45}%`,
          transform: 'translateX(-50%)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--lime)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          pointerEvents: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 10,
          whiteSpace: 'nowrap'
        }}>
          <div>{data[hoveredIdx].label}</div>
          <div style={{ color: 'var(--lime)', fontWeight: 'bold' }}>{data[hoveredIdx].value} mins</div>
        </div>
      )}
    </div>
  );
}

/**
 * Custom SVG Line Chart Component (Weight Progression)
 */
export function CustomLineChart({ data = [], height = 220 }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No data available</div>;

  const padding = { top: 20, right: 20, bottom: 30, left: 45 };
  const width = 500;
  
  const yValues = data.map(d => d.value);
  const maxY = Math.max(...yValues, 80) + 2;
  const minY = Math.min(...yValues, 70) - 2;

  const getX = (index) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const getY = (value) => padding.top + (1 - (value - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);

  let points = [];
  for (let i = 0; i < data.length; i++) {
    points.push(`${getX(i)},${getY(data[i].value)}`);
  }

  const linePath = points.length > 0 ? `M ${points.join(' L ')}` : '';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        {/* Y Axis Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
          const val = (minY + (maxY - minY) * ratio).toFixed(1);
          const y = getY(val);
          return (
            <g key={idx}>
              <line 
                x1={padding.left} 
                y1={y} 
                x2={width - padding.right} 
                y2={y} 
                stroke="var(--card-border)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding.left - 8} 
                y={y + 4} 
                fill="var(--text-secondary)" 
                fontSize="10" 
                textAnchor="end"
                fontFamily="var(--font-mono)"
              >
                {val}kg
              </text>
            </g>
          );
        })}

        {/* Glow behind line */}
        {linePath && (
          <path 
            d={linePath} 
            fill="none" 
            stroke="var(--lime)" 
            strokeWidth="5" 
            opacity="0.3"
            style={{ filter: 'blur(4px)' }}
          />
        )}

        {/* Actual Line */}
        {linePath && (
          <path 
            d={linePath} 
            fill="none" 
            stroke="var(--lime)" 
            strokeWidth="3" 
          />
        )}

        {/* Dots */}
        {data.map((item, idx) => {
          const x = getX(idx);
          const y = getY(item.value);
          const isHovered = hoveredIdx === idx;

          return (
            <g 
              key={idx} 
              onMouseEnter={() => setHoveredIdx(idx)} 
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle cx={x} cy={y} r="14" fill="transparent" />
              <circle 
                cx={x} 
                cy={y} 
                r={isHovered ? 6 : 4} 
                fill="var(--bg-primary)" 
                stroke="var(--lime)" 
                strokeWidth="3"
                style={{ transition: 'all 0.15s ease' }}
              />
            </g>
          );
        })}

        {/* X Axis Labels */}
        {data.map((item, idx) => {
          const x = getX(idx);
          return (
            <text 
              key={idx} 
              x={x} 
              y={height - 10} 
              fill="var(--text-secondary)" 
              fontSize="11" 
              textAnchor="middle"
            >
              {item.label}
            </text>
          );
        })}
      </svg>

      {/* Floating Tooltip */}
      {hoveredIdx !== null && (
        <div style={{
          position: 'absolute',
          left: `${(getX(hoveredIdx) / width) * 100}%`,
          top: `${(getY(data[hoveredIdx].value) / height) * 100 - 45}%`,
          transform: 'translateX(-50%)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--lime)',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-primary)',
          pointerEvents: 'none',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          zIndex: 10,
          whiteSpace: 'nowrap'
        }}>
          <div>{data[hoveredIdx].label}</div>
          <div style={{ color: 'var(--lime)', fontWeight: 'bold' }}>{data[hoveredIdx].value} kg</div>
        </div>
      )}
    </div>
  );
}
