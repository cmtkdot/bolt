export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };

  if (start.getFullYear() === end.getFullYear()) {
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', { ...options, year: undefined, month: 'long' })} - ${end.getDate()}, ${end.getFullYear()}`;
    } else {
      return `${start.toLocaleDateString('en-US', { ...options, year: undefined })} - ${end.toLocaleDateString('en-US', options)}`;
    }
  } else {
    return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
  }
}
