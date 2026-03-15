const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

function formatTimeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);

  if (seconds < MINUTE) return 'just now';
  if (seconds < HOUR) {
    const m = Math.floor(seconds / MINUTE);
    return `${m}m ago`;
  }
  if (seconds < DAY) {
    const h = Math.floor(seconds / HOUR);
    return `${h}h ago`;
  }
  const d = Math.floor(seconds / DAY);
  return `${d}d ago`;
}

interface TimeAgoProps {
  date: string;
}

export function TimeAgo({ date }: TimeAgoProps) {
  return (
    <time
      dateTime={date}
      title={new Date(date).toLocaleString()}
    >
      {formatTimeAgo(date)}
    </time>
  );
}
