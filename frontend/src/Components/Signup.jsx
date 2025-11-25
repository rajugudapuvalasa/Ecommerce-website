import React, { useState } from "react";
import "./App.css";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../pages/homepage/firebase";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- GOOGLE SIGNUP ----------------
  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const res = await fetch("http://localhost:5000/api/user/googleAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          password: "null",
          provider: "google",
        }),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (res.ok) {
        alert("Google Signup Successful!");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged"));
        navigate("/");
      } else {
        alert(data.message || "Google signup failed");
      }
    } catch (err) {
      console.error("Google Signup Error:", err);
      alert("Google Signup Failed");
    }
  };

  // ---------------- NORMAL SIGNUP ----------------
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (res.ok) {
        alert("Signup Successful!");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged"));
        navigate("/");
      } else {
        alert(data.message || "Signup Failed");
      }
    } catch (err) {
      console.error("Normal Signup Error:", err);
      alert("Signup Failed");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <input
          type="text"
          placeholder="Enter Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* ---------- PASSWORD WITH ICON ---------- */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Signup</button>

        <button className="google-btn" type="button" onClick={handleGoogleSignup}>
          <FcGoogle className="google-icon" /> Signup with Google
        </button>

        <p className="small-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
