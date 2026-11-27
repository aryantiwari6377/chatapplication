/**
 * REACT_APP_API_URL is the HTTP API base (usually ends with /api).
 * Socket.IO must connect to the server origin on the default namespace (/),
 * otherwise events like sendMessage never reach the backend handlers.
 */
export const getSocketUrl = () => {
  const apiUrl = (process.env.REACT_APP_API_URL || '').trim().replace(/\/+$/, '');
  return apiUrl.replace(/\/api$/i, '') || apiUrl;
};
