# Blood Donation Application - Client

Frontend application built with Vite, React, and Tailwind CSS.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navbar.jsx      # Navigation bar
│   └── Footer.jsx      # Footer component
├── pages/              # Page components
│   ├── HomePage.jsx    # Home page
│   ├── LoginPage.jsx   # Login page
│   ├── RegisterPage.jsx # Registration page
│   └── DashboardPages/ # Dashboard pages
├── utils/              # Utility functions
│   └── axiosInstance.js # Axios configuration
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Design System

### Colors

- **Primary:** Red (#e74c3c) - Blood donation theme
- **Secondary:** Blue (#3498db)
- **Dark:** #2c3e50
- **Light:** #ecf0f1

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔐 Environment Variables

Create a `.env` file with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## 📚 Key Technologies

- **Vite** - Next generation frontend tooling
- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Axios** - Promise-based HTTP client

## 🔄 API Integration

The client communicates with the backend API using axios. Requests automatically include JWT tokens from localStorage and handle authentication errors.

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:

- Mobile devices (320px and up)
- Tablets (768px and up)
- Desktop screens (1024px and up)

## 🚀 Deployment

### Vercel Deployment

```bash
npm run build
# Deploy using Vercel CLI or connect GitHub repo
```

### Netlify Deployment

```bash
npm run build
# Deploy build folder to Netlify
```

**Note:** Update Firebase domain in console for authorization when deploying to Vercel/Netlify.

## 📝 Contributing

1. Create a feature branch
2. Make your changes
3. Commit with meaningful messages
4. Push to the branch
5. Open a pull request

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3000
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Modules not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for the Blood Donation Application
