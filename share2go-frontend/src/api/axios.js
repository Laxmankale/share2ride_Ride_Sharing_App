import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URLL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    // List of public endpoints that don't require authentication
    const publicEndpoints = ['/auth/login', '/api/users/register'];

    // Check if the current request is to a public endpoint
    const isPublicEndpoint = publicEndpoints.some(endpoint =>
      config.url.includes(endpoint)
    );

    // Only add token if it's not a public endpoint
    if (!isPublicEndpoint) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token added to request:", token.substring(0, 20) + "...");
      } else {
        console.warn("No token found in localStorage");
      }
    } else {
      console.log("Public endpoint - no token required:", config.url);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("Invalid token - logging out");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.warn("Access forbidden - user lacks required permissions");
    }
    return Promise.reject(error);
  }
);

export default api;
