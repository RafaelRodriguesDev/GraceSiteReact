import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ResponsiveNavbar } from "./components/ResponsiveNavbar";
import { SwipeNavigationWrapper } from "./components/SwipeNavigationWrapper";
import { NewHome as Home } from "./pages/NewHome";
import { NewPortfolio as Portfolio } from "./pages/NewPortfolio";
import { NewScheduling as Scheduling } from "./pages/NewScheduling";
import { NewSobre as Sobre } from "./pages/NewSobre";
import NewPropostas from "./pages/NewPropostas";
import PropostasAdmin from "./pages/admin/PropostasAdmin";
import AlbumsAdmin from "./pages/AlbumsAdmin";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ToastProvider } from "./components/ui/Toast";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <ResponsiveNavbar />
            <Routes>
              {/* Rotas públicas */}
              <Route
                path="/"
                element={
                  <SwipeNavigationWrapper>
                    <main className="w-full lg:ml-[12%] lg:mr-0 pt-0 pb-20 lg:pb-0 px-0">
                      <Home />
                    </main>
                  </SwipeNavigationWrapper>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <SwipeNavigationWrapper>
                    <main className="w-full lg:ml-[12%] lg:mr-0 pt-16 lg:pt-0 pb-20 lg:pb-0">
                      <Portfolio />
                    </main>
                  </SwipeNavigationWrapper>
                }
              />
              <Route
                path="/agendamento"
                element={
                  <SwipeNavigationWrapper>
                    <main className="w-full lg:ml-[12%] lg:mr-0 pt-16 lg:pt-0 pb-20 lg:pb-0">
                      <Scheduling />
                    </main>
                  </SwipeNavigationWrapper>
                }
              />
              <Route
                path="/sobre"
                element={
                  <SwipeNavigationWrapper>
                    <main className="w-full lg:ml-[12%] lg:mr-0 pt-16 lg:pt-0 pb-20 lg:pb-0">
                      <Sobre />
                    </main>
                  </SwipeNavigationWrapper>
                }
              />
              <Route
                path="/propostas"
                element={
                  <SwipeNavigationWrapper>
                    <main className="w-full lg:ml-[12%] lg:mr-0 pt-16 lg:pt-0 pb-20 lg:pb-0">
                      <NewPropostas />
                    </main>
                  </SwipeNavigationWrapper>
                }
              />

              {/* Rota de login */}
              <Route path="/login" element={<Login />} />

              {/* Rotas protegidas */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <main className="w-full min-h-screen">
                      <Dashboard />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/propostas"
                element={
                  <ProtectedRoute>
                    <main className="w-full min-h-screen">
                      <PropostasAdmin />
                    </main>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/albums"
                element={
                  <ProtectedRoute>
                    <main className="w-full min-h-screen">
                      <AlbumsAdmin />
                    </main>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
