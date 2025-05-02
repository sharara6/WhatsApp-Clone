export function formatMessageTime(date) {
  if (!date) return '';
  
  // Handle both ISO string and timestamp formats
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    console.error('Invalid date:', date);
    return '';
  }

  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
