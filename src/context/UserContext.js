import { createContext, useContext, useState } from "react";

import { jwtDecode } from 'jwt-decode'; 
export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('token');
        return storedUser ? jwtDecode(storedUser) : null;
    });

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used inside the UserContextProvider");
    }

    return context;
};
