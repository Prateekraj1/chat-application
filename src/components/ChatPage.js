import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";

const ChatPage = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/");
            return;
        }

        // Ensure socket is connected
        if (!socket.connected) {
            socket.connect();
        }

        // Listen for messages and user updates
        socket.on("message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socket.on("userList", (userList) => {
            setUsers(userList);
        });

        socket.on("chatHistory", (messages) => {
            setMessages(messages.map((msg) => ({
                username: msg.username,
                text: msg.message,
                timestamp: msg.timestamp,
            })));
        });

        if (user) {
            socket.emit("join", user.username);
        }

        // Clean up socket listeners on unmount
        return () => {
            socket.off("message");
            socket.off("userList");
            socket.off("chatHistory");
        };
    }, [user, navigate]);

    const sendMessage = () => {
        if (input.trim() && user) {
            socket.emit("message", { username: user.username, text: input });
            setInput("");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        if (user) {
            socket.emit("logout", user.username);
        }
        socket.disconnect();
        navigate("/");
    };

    return (
        <div className="chat-container">
            <div className="header">
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
            <div className="chat_main_container">
                <div className="user-list">
                    <h3>Online Users</h3>
                    <ul>
                        {users.map((u, index) => (
                            <li key={index}>{u}</li>
                        ))}
                    </ul>
                </div>
                <div className="chat-box">
                    <div className="messages">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={msg.username === user.username ? "my-message" : "other-message"}
                            >
                                <strong>{msg.username}: </strong>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    <div className="input-container">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
