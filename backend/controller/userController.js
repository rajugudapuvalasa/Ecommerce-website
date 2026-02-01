import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admin from "../config/firebaseAdmin.js"
// 🔐 JWT generator
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

/* ===================== NORMAL SIGNUP ===================== */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists, please login" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "manual",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Signup successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup error", error: err.message });
  }
};

/* ===================== NORMAL LOGIN ===================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user || user.provider !== "manual")
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err.message });
  }
};

/* ===================== GOOGLE AUTH (SIGNUP + LOGIN) ===================== */
export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body; // Google ID token
    console.log(token)
    // 🔐 Verify token with Google
    const decoded = await admin.auth().verifyIdToken(token);

    const { email, name, uid, picture } = decoded;

    let user = await User.findOne({ email });

    // 🧱 Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        googleId: uid,
        provider: "google",
        avatar: picture,
      });
    }

    const jwtToken = generateToken(user);

    res.status(200).json({
      message: "Google authentication successful",
      token: jwtToken,
    });
  } catch (err) {
    res.status(500).json({ message: "Google auth failed", error: err.message });
  }
};

/* ===================== USERS CRUD ===================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user", error: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.status(200).json({ message: "Role updated", user });
  } catch (err) {
    res.status(500).json({ message: "Error updating role", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
};
