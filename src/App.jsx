import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./lib/supabase";
import MyStoriesPage from "./pages/stories/MyStoriesPage";
import ShopPage from "./pages/shop/ShopPage";
import QuestsPage from "./pages/quests/QuestsPage";
import "./App.css";
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
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/signup" ||
    location.pathname === "/login";

  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const check = async () => {
      const user = await getCurrentUser();
      setIsAuthenticated(!!user);
      setAuthChecked(true);
    };
    check();
  }, [location.pathname]);

  const Protected = ({ children }) => {
    if (!authChecked) return null; // ou loader
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  return (
    <>
      {!isAuthPage && <Header />}

      <div className="min-h-screen bg-white pb-16 lg:pb-0">
        <Routes>
          {/* Routes d'authentification */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Routes principales protégées */}
          <Route
            path="/home"
            element={
              <Protected>
                <HomePage />
              </Protected>
            }
          />
          <Route
            path="/stories"
            element={
              <Protected>
                <MyStoriesPage />
              </Protected>
            }
          />
          <Route
            path="/create"
            element={
              <Protected>
                <CreateStoryPage />
              </Protected>
            }
          />
          <Route
            path="/read/:id"
            element={
              <Protected>
                <ReadPage />
              </Protected>
            }
          />
          <Route
            path="/episodes/:id"
            element={
              <Protected>
                <EpisodesPage />
              </Protected>
            }
          />
          <Route
            path="/shop"
            element={
              <Protected>
                <ShopPage />
              </Protected>
            }
          />
          <Route
            path="/quests"
            element={
              <Protected>
                <QuestsPage />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <ProfilePage />
              </Protected>
            }
          />
          <Route
            path="/community"
            element={
              <Protected>
                <div>Communauté</div>
              </Protected>
            }
          />
          <Route
            path="/publish"
            element={
              <Protected>
                <div>Publication</div>
              </Protected>
            }
          />

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
