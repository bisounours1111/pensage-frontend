import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import HomePage from './pages/dashboard/HomePage'
import './App.css'
import Header from "./components/common/header";
import Navbar from "./components/common/navbar";

function App() {
  return (
    <Router>
      <Header />

      <div className="min-h-screen pb-20 lg:pb-0">
        <Routes>

          <Route path="/signup" element={<div>Signup</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<div>Boutique</div>} />
          <Route path="/profile" element={<div>Profil</div>} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />

          {/* Route par défaut */}
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Navbar />
    </Router>
  )
}

export default App
