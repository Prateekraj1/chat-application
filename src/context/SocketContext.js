import React, { createContext, useContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
    const socket = io(process.env.REACT_APP_BACKEND_URL);
    return (
        <SocketContext.Provider
            value={{
                socket
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("SocketContext must be used inside the SocketContextProvider");
    }

    return context;
};
