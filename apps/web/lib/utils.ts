export function getInitials(name: string) {
  return name.split(' ').map((s) => s.charAt(0).toUpperCase())
}

export function formatTimestamp(date: Date | string): string {
  // Convert string to Date object if needed
  let dateObj: Date;

  if (typeof date === 'string') {
    // If the string is in ISO format without timezone (e.g., "2026-01-29T06:22:01.923"),
    // append 'Z' to ensure it's parsed as UTC
    const isoWithoutTimezone = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?$/;
    if (isoWithoutTimezone.test(date)) {
      dateObj = new Date(date + 'Z');
    } else {
      dateObj = new Date(date);
    }
  } else {
    dateObj = date;
  }

  // toLocaleTimeString automatically converts to local timezone
  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDuration(start: Date | null, end: Date | null): string {
  if (!start || (!end)) return 'Unknown duration';
  const diffMs = end.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}