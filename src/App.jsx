import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
          <Route path="/stories" element={<div>Mes Histoires</div>} />
          <Route path="/create" element={<div>Éditeur</div>} />
          <Route path="/shop" element={<div>Boutique</div>} />
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
