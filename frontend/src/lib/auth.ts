export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function saveSession(accessToken: string, role: string, name: string) {
  localStorage.setItem('token', accessToken);
  localStorage.setItem('role', role);
  localStorage.setItem('name', name);
}

export function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('name');
}

export function getSession(): { role: string; name: string } | null {
  if (typeof window === 'undefined') return null;
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
  if (!role || !name) return null;
  return { role, name };
}