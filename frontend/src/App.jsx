import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import QuizPage from "./pages/QuizPage.jsx"; // New Quiz Page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Login Page */}
        <Route path="/home" element={<Home />} /> {/* Landing / Intro Page */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Main App */}
        <Route path="/quiz" element={<QuizPage />} /> {/* Quiz Page */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;






