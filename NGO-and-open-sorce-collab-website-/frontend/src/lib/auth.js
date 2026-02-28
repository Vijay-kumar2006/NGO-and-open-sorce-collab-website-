export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem('ngo_user');
  return raw ? JSON.parse(raw) : null;
};

export const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('ngo_token');
};

export const setStoredAuth = (token, user) => {
  if (typeof window === 'undefined') return;
  if (token) window.localStorage.setItem('ngo_token', token);
  if (user) window.localStorage.setItem('ngo_user', JSON.stringify(user));
  window.dispatchEvent(new Event('ngo-auth-change'));
};

export const clearStoredAuth = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('ngo_token');
  window.localStorage.removeItem('ngo_user');
  window.dispatchEvent(new Event('ngo-auth-change'));
};
