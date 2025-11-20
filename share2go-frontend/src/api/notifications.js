import api from "./axios";

export async function getUserNotifications(userId) {
  const res = await api.get(`/api/notifications/user/${userId}`);
  return res.data;
}

export async function getUnreadCount(userId) {
  const res = await api.get(`/api/notifications/user/${userId}/unread-count`);
  return res.data;
}

export async function markNotificationRead(id) {
  const res = await api.put(`/api/notifications/${id}/read`);
  return res.data;
}

export async function markAllNotificationsRead(userId) {
  const res = await api.put(`/api/notifications/user/${userId}/read-all`);
  return res.data;
}
