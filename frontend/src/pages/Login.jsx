import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/login/`, {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success("Login Successful ✅");

      setTimeout(() => {
        window.location.href = "/home"; // Redirect to Home page first
      }, 1500);
    } catch (err) {
      toast.error("Login Failed ❌");
    }
  };

  return (
    <div className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Animated floating shapes */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "loop" }}
        className="absolute w-40 h-40 bg-white rounded-full opacity-10 top-10 left-10"
      />
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "loop" }}
        className="absolute w-56 h-56 bg-white rounded-full opacity-10 bottom-20 right-20"
      />

      <ToastContainer position="top-center" autoClose={2000} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">
          Welcome Back
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Enter Username"
            className="w-full p-3 border rounded-lg focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              className="w-full p-3 border rounded-lg focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold shadow hover:bg-indigo-700"
          >
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;


