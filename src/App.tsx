import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Sobre } from './pages/Sobre';
import { Agenda } from './pages/Agenda';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
      </div>
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Obter a localização atual

  // Verifica se a rota atual é "/agendamento"
  const isAgendaPage = location.pathname === '/agendamento';

  return (
    <>
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/agendamento" element={<Agenda />} />
        </Routes>
      </main>
      {/* Renderiza a Navbar com posicionamento condicional */}
      <Navbar
        className={
          isAgendaPage
            ? 'fixed bottom-0 left-0 w-full h-16 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex justify-center items-center'
            : ''
        }
      />
    </>
  );
}

export default App;