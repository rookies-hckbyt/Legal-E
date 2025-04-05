import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
// import Summarisation from './pages/Summarisation';
// import Transcript from './pages/Transcript';
// import DocumentQuery from './pages/DocumentQuery';
// import Draft from './pages/Draft';
// import AdvocateDiary from './pages/AdvocateDiary';
import ChatSection from './components/Chatbot';
// import AuthPage from './pages/AuthPage';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        <div className="mt-[55px]">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* <Route path="/summarisation" element={<Summarisation />} />
            <Route path="/transcript" element={<Transcript />} />
            <Route path="/query" element={<DocumentQuery />} />
            <Route path="/draft" element={<Draft />} />
            <Route path="/advocate-diary" element={<AdvocateDiary />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} /> */}
          </Routes>
        </div>
      </div>
      <ChatSection />
    </div>
  );
};

export default App;