import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import './App.css'
import Header from "./components/common/header";
import Navbar from "./components/common/navbar";

function App() {
  return (
    <Router>
      <Header />

      <div className="min-h-screen bg-gray-50 pb-16">
        <Routes>

          <Route path="/signup" element={<div>Signup</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<div>Boutique</div>} />
          <Route path="/account" element={<div>Compte</div>} />
          <Route path="/notifications" element={<div>Notifications</div>} />
          <Route path="/quests" element={<div>Quests</div>} />
          <Route path="/profile" element={<div>Profil</div>} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />
          <Route path="/" element={<div>Accueil</div>} />
        </Routes>
      </div>
      <Navbar />
    </Router>
  )
}

export default App
