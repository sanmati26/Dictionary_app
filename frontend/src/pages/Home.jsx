// Home.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-indigo-50 flex flex-col items-center justify-center px-4 text-center">
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-indigo-700 mb-4"
      >
        Welcome to My Dictionary App
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-700 mb-6 max-w-lg"
      >
        Quickly search words, see meanings, synonyms, antonyms, hear pronunciation, and learn something new every day!
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/dashboard")}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700"
      >
        Get Started
      </motion.button>
    </div>
  );
};

export default Home;
