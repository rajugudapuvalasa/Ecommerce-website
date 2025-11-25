import React, { useState } from "react";
import "./App.css";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../pages/homepage/firebase";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ---------------- GOOGLE LOGIN ----------------
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;

      const res = await fetch("http://localhost:5000/api/user/googleAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (res.ok) {
        alert("Google Login Successful!");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged"));
        navigate("/");
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google Login Failed");
    }
  };

  // ---------------- NORMAL LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Backend Response:", data);

      if (res.ok) {
        alert("Login Successful!");
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("tokenChanged"));
        navigate("/");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Login Failed");
    }
  };

  return (
    <div className="container">
      <form className="form-box" onSubmit={handleLogin}>
        <h2>Login</h2>

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

        <button className="google-btn" type="button" onClick={handleGoogleLogin}>
          <FcGoogle className="google-icon" /> Login with Google
        </button>

        <p className="small-text">
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
