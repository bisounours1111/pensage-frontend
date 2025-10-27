import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import ShopPage from './pages/shop/ShopPage'
import QuestsPage from "./pages/quests/QuestsPage";
import './App.css'
import Header from "./components/common/header";
import Navbar from "./components/common/navbar";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import WelcomePage from "./pages/auth/WelcomePage";

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/' || location.pathname === '/signup' || location.pathname === '/login';

  return (
    <>
      {!isAuthPage && <Header />}

      <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
        <Routes>
          {/* Routes d'authentification */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Routes principales */}
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<ShopPage />} /> 
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/profile" element={<div>Profil</div>} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />
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
