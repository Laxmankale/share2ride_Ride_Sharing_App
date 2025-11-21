import api from "./axios";

export async function loginApi(email, password) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function registerApi(userData) {
  const res = await api.post("/api/users/register", userData);
  return res.data;
}
