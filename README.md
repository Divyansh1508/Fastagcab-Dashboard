# FastagCab Dashboard

A full-stack dashboard application with separate client and server components.

## Project Structure

```
project/
├── client/                 # Frontend React application
│   ├── src/               # React source code
│   ├── dist/              # Built frontend files
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.ts     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── ...                # Other frontend config files
├── server/                # Backend Node.js application
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Express middleware
│   ├── scripts/           # Utility scripts
│   ├── uploads/           # File uploads directory
│   ├── package.json       # Backend dependencies
│   └── index.js           # Server entry point
├── package.json           # Root package.json for managing both
└── README.md              # This file
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Installation

1. Install dependencies for both client and server:
```bash
npm run install-all
```

Or install them separately:
```bash
# Install client dependencies
npm run install-client

# Install server dependencies
npm run install-server
```

### Development

1. Start both client and server in development mode:
```bash
npm run dev
```

2. Or run them separately:
```bash
# Start only the client (frontend)
npm run client

# Start only the server (backend)
npm run server
```

### Building for Production

1. Build the client for production:
```bash
npm run build
```

### Deployment

This project is structured for VPS deployment where you can:
- Deploy the client (frontend) to any static hosting service or serve it from your VPS
- Deploy the server (backend) to your VPS
- Both can run independently on different servers if needed

### Environment Variables

Create a `.env` file in the server directory with your configuration:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run client` - Start only the frontend development server
- `npm run server` - Start only the backend server
- `npm run build` - Build the frontend for production
- `npm run install-all` - Install dependencies for both client and server
- `npm run install-client` - Install only client dependencies
- `npm run install-server` - Install only server dependencies
