import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Search from "./pages/Search"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import UserLogin from "./pages/UserLogin"
import UserDashboard from "./pages/UserDashboard"
import EmailTest from "./pages/EmailTest"
import { AdminProvider } from "./context/AdminContext"
import { UserProvider } from "./context/UserContext"
import { ThemeProvider } from "./context/ThemeContext"

// Create a component to conditionally render navbar
function AppContent() {
  const location = useLocation()
  const hideNavbar =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/login" ||
    location.pathname === "/user/login" ||
    location.pathname === "/user/dashboard"

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-600/5 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10 transition-colors duration-300">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/email-test" element={<EmailTest />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AdminProvider>
        <UserProvider>
          <Router>
            <AppContent />
          </Router>
        </UserProvider>
      </AdminProvider>
    </ThemeProvider>
  )
}

export default App
