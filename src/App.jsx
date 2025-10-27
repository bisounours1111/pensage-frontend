import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import ShopPage from './pages/shop/ShopPage'
import QuestsPage from "./pages/quests/QuestsPage";
import './App.css'
import Header from "./components/common/header";
import Navbar from "./components/common/navbar";
import WelcomePage from "./pages/auth/WelcomePage";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import CreateStoryPage from "./pages/create/CreateStoryPage";
import EpisodesPage from "./pages/episodes/EpisodesPage";
import ProfilePage from "./pages/profile/ProfilePage";
import OnboardingPage from "./pages/auth/OnboardingPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || 
                     location.pathname === '/signup' || 
                     location.pathname === '/login' || 
                     location.pathname === '/onboarding';

  return (
    <>
      {!isAuthPage && <Header />}

      <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
        <Routes>
          {/* Routes d'authentification */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          
          {/* Routes principales protégées */}
          <Route path="/home" element={<ProtectedRoute><div>Home</div></ProtectedRoute>} />
          <Route path="/stories" element={<ProtectedRoute><MyStoriesPage /></ProtectedRoute>} />
          <Route path="/create" element={<ProtectedRoute><CreateStoryPage /></ProtectedRoute>} />
          <Route path="/episodes/:id" element={<ProtectedRoute><EpisodesPage /></ProtectedRoute>} />
          <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} /> 
          <Route path="/quests" element={<ProtectedRoute><QuestsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><div>Communauté</div></ProtectedRoute>} />
          <Route path="/publish" element={<ProtectedRoute><div>Publication</div></ProtectedRoute>} />
        </Routes>
      </div>
      {!isAuthPage && <Navbar />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
