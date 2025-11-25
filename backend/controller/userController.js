import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            provider: "manual",
        });

        const savedUser = await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: savedUser,
        });

    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Compare password
        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            "SECRET_KEY",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user,
        });

    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

// GOOGLE AUTH
export const googleAuth = async (req, res) => {
    try {
        const { name, email, photo } = req.body;   // FIXED (photo added)

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create user without password
            user = await User.create({
                name,
                email,
                password: null,
                provider: "google",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            "SECRET_KEY",
            { expiresIn: "7d" }
        );

        res.status(200).json({
            message: "Google Login Successful",
            token,
            user,
        });

    } catch (err) {
        res.status(500).json({ message: "Error in Google Auth", error: err.message });
    }
};


export const getAllUsers = async (req,res) => {
    try{
        const users = await User.find().select('-password');
        res.status(200).json({message : " success" ,users});
    }catch(err)
    {
        res.status(500).json({message : "Error fetching users", error : err.message});
    }
};