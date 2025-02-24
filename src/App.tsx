import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Scheduling } from './pages/Scheduling';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/agendamento" element={<Scheduling />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App