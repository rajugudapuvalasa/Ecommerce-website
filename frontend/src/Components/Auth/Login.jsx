import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./user.css";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "./firebase"
import { toast } from "react-hot-toast";
import API_URL from "../../Api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async () => {
    try {
      const {token} = await signInWithGoogle();
      const res = await fetch(`${API_URL}/users/googleAuth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Google login successful");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged")); 
        navigate("/");
      } else {
        toast.error(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      toast.error("Google Login Failed");
    }
  };

  // ---------------- NORMAL LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Login successful");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged")); 
        navigate("/");
      } else {
        toast.error(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleLogin}>
        <h2>Login</h2>
        <button className="google-btn" type="button" onClick={handleGoogleLogin}>
          <FcGoogle className="google-icon" /> Login with Google
        </button>
        <br />
        <p>- or -</p>
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div style={{ position: "relative", width: "100%" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", paddingRight: "40px" }}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Login</button>

        <p className="small-text">
          Don't have an account? 
          <Link to="/signup" className="link">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
