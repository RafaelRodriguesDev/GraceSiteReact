import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Scheduling } from './pages/Scheduling';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={
              <>
                <Navbar />
                <main className="w-full">
                  <Home />
                </main>
              </>
            } />
            <Route path="/portfolio" element={
              <>
                <Navbar />
                <main className="w-full">
                  <Portfolio />
                </main>
              </>
            } />
            <Route path="/agendamento" element={
              <>
                <Navbar />
                <main className="w-full">
                  <Scheduling />
                </main>
              </>
            } />
            
            {/* Rota de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App