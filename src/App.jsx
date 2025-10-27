import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import ShopPage from './pages/shop/ShopPage'
import './App.css'
import Header from "./components/common/header";
import Navbar from "./components/common/navbar";
import CreateStoryPage from "./pages/create/CreateStoryPage";

function App() {
  return (
    <Router>
      <Header />

      <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
        <Routes>
          <Route path="/signup" element={<div>Signup</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<ShopPage />} /> 
          <Route path="/profile" element={<div>Profil</div>} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />
          <Route path="/" element={<div>Accueil</div>} />
        </Routes>
      </div>
      <Navbar />
    </Router>
  );
}

export default App;
