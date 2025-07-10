import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Scheduling } from './pages/Scheduling';
import { Sobre } from './pages/Sobre';
import Propostas from './pages/Propostas';
import PropostasAdmin from './pages/admin/PropostasAdmin';
import AlbumsAdmin from './pages/AlbumsAdmin';
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
            <Route path="/sobre" element={
              <>
                <Navbar />
                <main className="w-full">
                  <Sobre />
                </main>
              </>
            } />
            <Route path="/propostas" element={
              <>
                <Navbar />
                <main className="w-full">
                  <Propostas />
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
            <Route path="/admin/propostas" element={
              <ProtectedRoute>
                <PropostasAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/albums" element={
              <ProtectedRoute>
                <AlbumsAdmin />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App