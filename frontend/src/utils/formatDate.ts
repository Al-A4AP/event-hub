/**
 * Format ISO date string ke format bahasa Indonesia
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const formatDayMonth = (dateString: string): { day: string; month: string } => {
  const date = new Date(dateString);
  return {
    day: new Intl.DateTimeFormat('id-ID', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('id-ID', { month: 'short' }).format(date).toUpperCase(),
  };
};
