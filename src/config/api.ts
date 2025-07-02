// API configuration
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  const isDev = import.meta.env.DEV;

  // Get environment variables
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;

  // For development: use localhost unless explicitly overridden
  if (isDev) {
    return envApiUrl || "http://localhost:5000";
  }

  // For production: use environment variable or production server
  return envApiUrl || "https://fastagcab-dashboard.onrender.com";
};

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),

  // API endpoints
  endpoints: {
    auth: {
      login: "/api/auth/login",
      me: "/api/auth/me",
      logout: "/api/auth/logout",
    },
    users: "/api/users",
    schemes: "/api/schemes",
    products: "/api/products",
    redeem: "/api/redeem",
    dashboard: "/api/dashboard",
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseURL}${endpoint}`;
};

// Log the current API configuration (for debugging)
console.log("🔧 API Configuration:", {
  baseURL: API_CONFIG.baseURL,
  environment: import.meta.env.MODE,
  isDev: import.meta.env.DEV,
  envVariable: import.meta.env.VITE_API_BASE_URL,
});
