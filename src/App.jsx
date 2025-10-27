import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Routes principales */}
          <Route path="/signup" element={<div>Signup</div>} />
          <Route path="/login" element={<div>Login</div>} />
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<div>Boutique</div>} />
          <Route path="/profile" element={<div>Profil</div>} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />

          {/* Route par défaut */}
          <Route path="/" element={<div>Accueil</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App