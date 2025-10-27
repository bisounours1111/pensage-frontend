import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MyStoriesPage from './pages/stories/MyStoriesPage'
import SignupPage from './pages/auth/SignupPage'
import WelcomePage from './pages/auth/WelcomePage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Routes d'authentification */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<div>Login</div>} />
          
          {/* Routes principales */}
          <Route path="/home" element={<div>Home</div>} />
          <Route path="/stories" element={<MyStoriesPage />} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<div>Boutique</div>} />
          <Route path="/profile" element={<div>Profil</div>} />
          <Route path="/community" element={<div>Communauté</div>} />
          <Route path="/publish" element={<div>Publication</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App