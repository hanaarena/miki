interface SparklineProps {
  points: number[];
  positive: boolean;
  width?: number;
  height?: number;
}

export function Sparkline({ points, positive, width = 100, height = 28 }: SparklineProps) {
  if (points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const padding = 2;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;

  const coords = points.map((val, i) => {
    const x = padding + (i / (points.length - 1)) * innerWidth;
    const y = padding + innerHeight - ((val - min) / range) * innerHeight;
    return `${x},${y}`;
  });

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block' }}
    >
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={positive ? 'var(--color-positive)' : 'var(--color-negative)'}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
