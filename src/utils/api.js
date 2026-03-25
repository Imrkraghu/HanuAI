const apiBaseUrl = "https://attendance.hanuai.com/api";
export async function apiCall(path, method = 'GET', data = null, token = null) {
  method = (method || 'GET').toUpperCase();
  let cleanPath = path.startsWith('/') ? path.slice(1) : path;
  let url = apiBaseUrl + '/' + cleanPath;

  const opts = { method, headers: { 'Cache-Control': 'no-cache' }, cache: 'no-store' };

  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`;
  }

  if (method !== 'GET' && data !== null) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    return JSON.parse(text);
  } catch (error) {
    console.error("API Call failed:", error);
    return { success: false, message: "Network error or server unreachable" };
  }
}