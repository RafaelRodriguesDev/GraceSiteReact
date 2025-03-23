import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Sobre } from './pages/Sobre';
import { Agenda } from './pages/Agenda';
import  Propostas  from './pages/Propostas';
import PDFCarouselTest from './pages/PDFCarouselTest';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="min-h-screen bg-white">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isAgendaPage = location.pathname === '/agendamento';

  const computedClassName: string = isAgendaPage
    ? 'fixed bottom-0 left-0 w-full h-16 bg-white/80 backdrop-blur-sm border-t border-gray-200 flex justify-center items-center'
    : '';

  return (
    <>
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/agendamento" element={<Agenda />} />
          <Route path="/propostas" element={<Propostas />} />
          <Route path="/PDFCarouselTest" element={<PDFCarouselTest />} />
        </Routes>
      </main>
      <Navbar className={computedClassName} />
    </>
  );
}

export default App;
