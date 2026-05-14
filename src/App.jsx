import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import PortfolioDashboard from './pages/portfolio/PortfolioDashboard';
import Maestros from './pages/maestros/Maestros';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-background text-text-main">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/servicios" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contacto" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Rutas Protegidas */}
              <Route 
                path="/cartera" 
                element={
                  <ProtectedRoute>
                    <PortfolioDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/maestros" 
                element={
                  <ProtectedRoute>
                    <Maestros />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

