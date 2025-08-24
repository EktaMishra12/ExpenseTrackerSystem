import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, DollarSign } from 'lucide-react';
import './signup.css';

export default function Signup() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword)
            return 'Please fill in all fields';
        if (formData.name.length < 2)
            return 'Name must be at least 2 characters long';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email))
            return 'Please enter a valid email';
        if (formData.password.length < 6)
            return 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword)
            return 'Passwords do not match';
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            // Get existing users from localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Check if email already exists
            const existingUser = users.find(u => u.email === formData.email);
            if (existingUser) {
                setError('Email is already registered');
                setIsLoading(false);
                return;
            }

            // Save new user
            const newUser = {
                name: formData.name,
                email: formData.email,
                password: formData.password
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            setIsLoading(false);
            navigate('/login'); // redirect to login after signup
        }, 1000);
    };

    return (
        <div className="signup-page">
            {/* 🔵 Floating Bubbles Background */}
            <div className="bubbles">
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
            </div>

            {/* Header */}
            <header className="signup-header">
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
            <div className="signup-wrapper">
                <div className="signup-card">
                    <div className="card-header">
                        <DollarSign className="card-icon" />
                        <h2>Create Account</h2>
                        <p>Fill your details to start tracking expenses</p>
                    </div>

                    <form onSubmit={handleSubmit} className="signup-form">
                        {error && <div className="error">{error}</div>}

                        {/* Full Name */}
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <div className="input-wrapper">
                                <User className="input-icon" />
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <Mail className="input-icon" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={handleChange}
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

                        {/* Confirm Password */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <Lock className="input-icon" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    className="eye-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="submit-btn">
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="switch-text">
                        Already have an account? <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
