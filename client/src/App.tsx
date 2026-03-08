import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ui/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { TopicsPage } from './pages/TopicsPage'
import { QuestionsPage } from './pages/QuestionsPage'
import { QuestionDetailPage } from './pages/QuestionDetailPage'
import { BookmarksPage } from './pages/BookmarksPage'
import { MockTestsPage } from './pages/MockTestsPage'
import { useAuth } from './context/AuthContext'

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  return (
    <>
      {user && <Navbar />}
      {children}
    </>
  )
}

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/topics" element={<ProtectedRoute><TopicsPage /></ProtectedRoute>} />
        <Route path="/topics/:slug" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
        <Route path="/questions/:id" element={<ProtectedRoute><QuestionDetailPage /></ProtectedRoute>} />
        <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
        <Route path="/tests" element={<ProtectedRoute><MockTestsPage /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  )
}

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App