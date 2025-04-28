/**
 * Date utility functions
 */

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get a short format date (MM/DD/YYYY)
 */
export const formatShortDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US');
};

/**
 * Format time (HH:MM AM/PM)
 */
export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Get current date string in ISO format
 */
export const getCurrentDateISOString = (): string => {
  return new Date().toISOString();
};

/**
 * Get current date formatted for display
 */
export const getCurrentDateFormatted = (): string => {
  return formatDate(new Date());
};

/**
 * Get a date range for the past n days
 */
export const getPastDays = (days: number): Date[] => {
  const result: Date[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    result.push(date);
  }
  
  return result;
};

/**
 * Group dates by week
 */
export const groupByWeek = <T extends { date: string }>(items: T[]): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const date = new Date(item.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const key = weekStart.toISOString().split('T')[0];
    
    if (!groups[key]) {
      groups[key] = [];
    }
    
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};