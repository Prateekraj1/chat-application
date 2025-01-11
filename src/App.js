import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import ChatPage from './components/ChatPage';
import io from "socket.io-client";
export const socket = io("http://localhost:5000");
const App = () => {

  return (
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Router>
    </UserContextProvider>
  );
};

export default App;