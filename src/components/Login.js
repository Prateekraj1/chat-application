import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import api from './api';
import { socket } from "../App";
import { useForm } from 'react-hook-form';

const LoginPage = () => {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await api.post('/login', data);
            setUser(response.data);
            localStorage.setItem('token', response.data.token); // Save token
            navigate("/chat");
        } catch (error) {
            console.error('Login failed:', error.response?.data || error.message);
        }
    };
    return (
        <div className="login-container">
            <h1>Login to ChatApp</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register('username', { required: 'Username is required' })}
                    placeholder="Username"
                />
                {errors.username && <p className="error">{errors.username.message}</p>}

                <input
                    type="password"
                    {...register('password', { required: 'Password is required' })}
                    placeholder="Password"
                />
                {errors.password && <p className="error">{errors.password.message}</p>}

                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <span onClick={() => navigate('/register')}>Register</span>
            </p>
        </div>
    );
};

export default LoginPage;