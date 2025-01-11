import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserContextProvider } from './context/UserContext';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import ChatPage from './components/ChatPage';
import io from "socket.io-client";
import { SocketContextProvider } from './context/SocketContext';
export const socket = io(process.env.REACT_APP_BACKEND_URL);
const App = () => {
  return (
    <UserContextProvider>
      <SocketContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </Router>
      </SocketContextProvider>
    </UserContextProvider>

  );
};

export default App;