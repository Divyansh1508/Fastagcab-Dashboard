# Frontend API Configuration

This document explains how the frontend is configured to use environment variables for API endpoints.

## Environment Variables

### Development
For local development, the frontend will use `http://localhost:5000` by default if no environment variable is set.

### Production
For production builds, set the `VITE_API_BASE_URL` environment variable to your production server URL.

## Configuration Files

### `.env` (Main environment file)
```
VITE_API_BASE_URL=https://fastagcab-dashboard.onrender.com
```

### `.env.local` (Local development overrides)
```
# Uncomment to override the API URL for local development
# VITE_API_BASE_URL=http://localhost:5000
```

### `.env.production` (Production environment)
```
VITE_API_BASE_URL=https://fastagcab-dashboard.onrender.com
```

## How It Works

1. **Vite Configuration** (`vite.config.ts`):
   - Loads environment variables using `loadEnv()`
   - Uses `SERVER_URL` from `.env` as the default API target
   - Defines `VITE_API_BASE_URL` for the frontend to use
   - Configures proxy for development server

2. **Frontend Configuration** (`src/config/api.ts`):
   - Centralizes API configuration
   - Provides helper functions for API endpoints
   - Logs configuration in development mode

3. **Axios Setup** (`src/App.tsx`):
   - Configures axios base URL using the environment variable
   - Falls back to localhost for development

## Environment Variable Priority

1. `.env.local` (highest priority, git-ignored)
2. `.env.production` (for production builds)
3. `.env` (default values)
4. Hardcoded fallback: `http://localhost:5000`

## Deployment

When deploying to production:

1. Set the `VITE_API_BASE_URL` environment variable in your hosting platform
2. Or ensure `.env.production` is included in your build
3. The frontend will automatically use the production API URL

## Testing

To test with different API URLs:

1. Create a `.env.local` file
2. Set `VITE_API_BASE_URL=your-test-url`
3. Restart the development server

The configuration will be logged to the browser console in development mode.
