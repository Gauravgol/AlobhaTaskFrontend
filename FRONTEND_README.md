# Todo Manager Frontend

A React-based frontend for the Team-Based Todo Manager application with role-based permissions, team management, and comprehensive logging.

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes with role restrictions
- Persistent login state

### 👥 Team Management (Admin Only)
- Create and manage teams
- Add/remove users from teams
- View team members and their roles
- Team-based todo organization

### 📝 Todo Management
- Create todos within teams
- Edit todos (creator or shared access only)
- Share todo edit access with team members
- Filter todos by team, status, and title
- Mark todos as completed

### 👤 User Management (Admin Only)
- Create new users
- Update user information and roles
- Delete users
- View all system users

### 📊 System Logs (Admin Only)
- View comprehensive audit trail
- Filter logs by user, date range
- Track all critical system actions
- Log summary statistics

## Tech Stack

- **React 19** - Frontend framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env file with:
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── api/                 # API configuration and endpoints
│   ├── authApi.js      # Authentication API calls
│   └── axiosInstance.js # Axios configuration with interceptors
├── components/         # Reusable UI components
│   ├── Navbar.jsx     # Navigation component
│   └── ProtectedRoute.jsx # Route protection component
├── pages/             # Page components
│   ├── Dashboard.jsx  # Main dashboard with todos
│   ├── LoginPage.jsx  # User login
│   ├── RegisterPage.jsx # User registration
│   ├── TeamsPage.jsx  # Team management (Admin)
│   ├── UsersPage.jsx  # User management (Admin)
│   └── LogsPage.jsx   # System logs (Admin)
├── redux/             # Redux store and slices
│   ├── store.js       # Redux store configuration
│   ├── authSlice.js   # Authentication state
│   ├── todoSlice.js   # Todo management state
│   ├── teamSlice.js   # Team management state
│   ├── userSlice.js   # User management state
│   └── logSlice.js    # Logs state
└── routes/            # Application routing
    └── AppRoutes.jsx  # Route definitions
```

## Key Features Implementation

### Role-Based Access Control
- Admin users can access all features
- Regular users can only access dashboard and their team todos
- Protected routes automatically redirect unauthorized users

### Todo Sharing System
- Users can share edit access with team members
- Only creators and shared users can edit todos
- Visual indicators show edit permissions

### Real-time State Management
- Redux store manages all application state
- Optimistic updates for better UX
- Error handling with user feedback

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive tables and modals
- Clean, modern UI design

## API Integration

The frontend integrates with the backend API through:
- Centralized axios instance with JWT token handling
- Automatic token refresh and error handling
- Consistent error messaging

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration for code quality
- Consistent component structure
- Proper error handling and loading states

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Ensure environment variables are set correctly for production

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states for async operations
4. Test all user flows thoroughly
