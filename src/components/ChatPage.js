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
        }
        if (user) {
            socket.emit("join", user.username);
        }
    }, []);

    useEffect(() => {

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
                timestamp: msg.timestamp
            })));
        });

        return () => {
            socket.off("message");
            socket.off("userList");
            socket.off("chatHistory");
            socket.disconnect();
        };
    }, [user]);

    const sendMessage = () => {
        if (input.trim()) {
            socket.emit("message", { username: user.username, text: input });
            setInput("");
        }
    };

    return (
        <div className="chat-container">
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
    );
};


export default ChatPage;
