import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, DollarSign } from 'lucide-react';
import './login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!email || !password) {
            setError('Please fill in all fields');
            setIsLoading(false);
            return;
        }

        // 1. Demo account login
        if (email === 'demo@example.com' && password === 'demo123') {
            navigate('/dashboard');
            setIsLoading(false);
            return;
        }

        // 2. Check registered users from localStorage (array format from Signup.jsx)
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(
            (u) => u.email === email && u.password === password
        );

        if (existingUser) {
            navigate('/dashboard'); // ✅ successful login
        } else {
            setError('Invalid email or password');
        }

        setIsLoading(false);
    };

    return (
        <div className="login-page">
            {/* Header */}
            <header className="login-header">
                <h1 className="logo">
                    <DollarSign className="logo-icon" />
                    Expensify
                </h1>
                <nav>
                    <Link to="/login" className="nav-link">Login</Link>
                    <Link to="/signup" className="nav-link">Signup</Link>
                </nav>
            </header>

            {/* Center Card */}
            <div className="login-wrapper">
                <div className="login-card">
                    <div className="card-header">
                        <DollarSign className="card-icon" />
                        <h2>Login</h2>
                        <p>Sign in to your expense tracker account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error">{error}</div>}

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="submit-btn">
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="switch-text">
                        Don’t have an account? <Link to="/signup">Create one now</Link>
                    </p>

                    <div className="demo-box">
                        <p><strong>Demo Account:</strong></p>
                        <p>Email: demo@example.com<br />Password: demo123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
