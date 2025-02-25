import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Sobre } from './pages/Sobre';
import { Agenda } from './pages/Agenda';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/agendamento" element={<Agenda />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App