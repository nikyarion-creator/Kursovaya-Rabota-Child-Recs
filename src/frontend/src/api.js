const BASE = '/api'

async function request(method, path, body) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Ошибка запроса')
  }
  return res.json()
}

async function requestForm(method, path, formData) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || 'Ошибка запроса')
  }
  return res.json()
}

export const api = {
  me: () => request('GET', '/auth/me'),
  register: (data) => request('POST', '/auth/register', data),
  login: (data) => request('POST', '/auth/login', data),
  logout: () => request('POST', '/auth/logout'),
  getChildProfile: () => request('GET', '/child-profile'),
  saveChildProfile: (data) => request('POST', '/child-profile', data),
  getRecommendations: (period) => request('GET', `/recommendations${period ? `?period=${period}` : ''}`),
  getEvent: (id) => request('GET', `/events/${id}`),
  buyTicket: (id) => request('POST', `/events/${id}/buy`),
  subscribeToEvent: (id) => request('POST', `/events/${id}/subscribe`),
  unsubscribeFromEvent: (id) => request('DELETE', `/events/${id}/subscribe`),
  getMyTickets: () => request('GET', '/my-tickets'),
  returnTicket: (purchaseId, formData) => requestForm('POST', `/tickets/${purchaseId}/return`, formData),
  getEventCounts: () => request('GET', '/events/counts'),
  getNotifications: () => request('GET', '/notifications'),
  markNotificationsRead: () => request('POST', '/notifications/read'),
}
