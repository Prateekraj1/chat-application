import { useNavigate } from "react-router-dom";
import api from './api';
import { useForm } from 'react-hook-form';

const RegisterPage = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            await api.post('/register', data);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
        }
    };
    return (
        <div className="login-container">
            <h1>Register for ChatApp</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register('username', {
                        required: 'Username is required',
                        minLength: { value: 3, message: 'Username must be at least 3 characters long' },
                    })}
                    placeholder="Username"
                />
                {errors.username && <p className="error">{errors.username.message}</p>}

                <input
                    type="password"
                    {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                    })}
                    placeholder="Password"
                />
                {errors.password && <p className="error">{errors.password.message}</p>}

                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <span onClick={() => navigate('/')}>Login</span>
            </p>
        </div>
    );
};
export default RegisterPage;