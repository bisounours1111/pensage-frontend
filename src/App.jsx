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
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage";
import PaymentCancelPage from "./pages/payment/PaymentCancelPage";
import ProfilePage from "./pages/profile/ProfilePage";
import HomePage from "./pages/dashboard/HomePage";
import ReadPage from "./pages/read/ReadPage";

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
          <Route path="/home" element={<HomePage />} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<CreateStoryPage />} />
          <Route path="/read/:id" element={<ReadPage />} />
          <Route path="/episodes/:id" element={<EpisodesPage />} />
          <Route path="/shop" element={<ShopPage />} /> 
          <Route path="/quests" element={<QuestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />
          
          {/* Pages de paiement */}
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
          <Route path="/payment/cancel" element={<PaymentCancelPage />} />
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
