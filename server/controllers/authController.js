import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = user => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await User.create({ name, email, password });
        console.log('✅ New user created:', user.email);

        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        console.error('❌ Signup error:', err.message);
        res.status(500).json({ message: 'Signup failed' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.warn('⚠️ Login failed: Email not found');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.warn('⚠️ Login failed: Incorrect password');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        console.log('✅ Login successful for:', user.email);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error('❌ Login error:', err.message);
        res.status(500).json({ message: 'Login failed' });
    }
};