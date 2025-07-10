import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ResponsiveNavbar } from "./components/ResponsiveNavbar";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { Scheduling } from "./pages/Scheduling";
import { Sobre } from "./pages/Sobre";
import Propostas from "./pages/Propostas";
import PropostasAdmin from "./pages/admin/PropostasAdmin";
import AlbumsAdmin from "./pages/AlbumsAdmin";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <ResponsiveNavbar />
          <Routes>
            {/* Rotas públicas */}
            <Route
              path="/"
              element={
                <main className="w-full lg:ml-[15%] lg:mr-[2%] pt-16 lg:pt-0 pb-20 lg:pb-0">
                  <Home />
                </main>
              }
            />
            <Route
              path="/portfolio"
              element={
                <main className="w-full lg:ml-[15%] lg:mr-[2%] pt-16 lg:pt-0 pb-20 lg:pb-0">
                  <Portfolio />
                </main>
              }
            />
            <Route
              path="/agendamento"
              element={
                <main className="w-full lg:ml-[15%] lg:mr-[2%] pt-16 lg:pt-0 pb-20 lg:pb-0">
                  <Scheduling />
                </main>
              }
            />
            <Route
              path="/sobre"
              element={
                <main className="w-full lg:ml-[15%] lg:mr-[2%] pt-16 lg:pt-0 pb-20 lg:pb-0">
                  <Sobre />
                </main>
              }
            />
            <Route
              path="/propostas"
              element={
                <main className="w-full lg:ml-[15%] lg:mr-[2%] pt-16 lg:pt-0 pb-20 lg:pb-0">
                  <Propostas />
                </main>
              }
            />

            {/* Rota de login */}
            <Route path="/login" element={<Login />} />

            {/* Rotas protegidas */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/propostas"
              element={
                <ProtectedRoute>
                  <PropostasAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/albums"
              element={
                <ProtectedRoute>
                  <AlbumsAdmin />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
