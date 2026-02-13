import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./user.css";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "./firebase"
import { toast } from "react-hot-toast";
import API_URL from "../../Api"

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- GOOGLE SIGNUP ----------------
  const handleGoogleSignup = async () => {
    try {
      const {token} = await signInWithGoogle();
      const res = await fetch(`${API_URL}/users/googleAuth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({token}),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Google signup successful");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged"));  
        navigate("/");
      } else {
        toast.error(data.message || "Google signup failed");
      }
    } catch (err) {
      console.error("Google Signup Error:", err);
      toast.error("Google Signup Failed");
    }
  };

  // ---------------- NORMAL SIGNUP ----------------
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Signup successful");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged"));  
        navigate("/");
      } else {
        toast.error(data.message || "Signup Failed");
      }
    } catch (err) {
      console.error("Normal Signup Error:", err);
      toast.error("Signup Failed");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>
        <button className="google-btn" type="button" onClick={handleGoogleSignup}>
          <FcGoogle className="google-icon" /> Signup with Google
        </button>
        <br />
        <p>- or -</p>
        <br />
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

        <p className="small-text">
          Already have an account?{" "}
          <Link to="/login" className="link">Login</Link>
        </p>

      </form>
    </div>
  );
}

export default Signup;
