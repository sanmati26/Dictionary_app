import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { LogOut, Search, Clock, Trash2, Copy } from "lucide-react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [meaning, setMeaning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "single" or "all"

  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentWords")) || [];
    setRecentSearches(recent);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const addRecentSearch = (w) => {
    let recent = [w, ...recentSearches.filter((item) => item !== w)];
    if (recent.length > 15) recent.pop();
    setRecentSearches(recent);
    localStorage.setItem("recentWords", JSON.stringify(recent));
  };

  const confirmDeleteWord = (w) => {
    setDeleteTarget(w);
    setModalType("single");
    setShowModal(true);
  };

  const confirmClearAll = () => {
    setModalType("all");
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (modalType === "single") {
      const updated = recentSearches.filter((word) => word !== deleteTarget);
      setRecentSearches(updated);
      localStorage.setItem("recentWords", JSON.stringify(updated));
      toast.success("Word removed from history");
    } else if (modalType === "all") {
      setRecentSearches([]);
      localStorage.removeItem("recentWords");
      toast.success("History cleared");
    }
    setShowModal(false);
  };

  const playAudio = (url) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play();
  };

  const copyDefinition = () => {
    if (meaning?.mainDefinition) {
      navigator.clipboard.writeText(meaning.mainDefinition);
      toast.success("Definition copied to clipboard!");
    }
  };

  const fetchMeaning = async (searchWord) => {
    const w = searchWord || word;
    if (!w.trim()) {
      toast.error("Please enter a word");
      return;
    }

    try {
      setLoading(true);
      setMeaning(null);

     const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/meaning/${w}`);
      if (!res.data || !res.data[0] || !res.data[0].meanings) {
        throw new Error("No data found");
      }

      const data = res.data[0].meanings[0];
      const mainDefinition =
        data.definitions[0]?.definition || "No meaning available";
      const synonyms = data.synonyms ? data.synonyms.slice(0, 5) : [];
      const antonyms = data.antonyms ? data.antonyms.slice(0, 5) : [];

      const phoneticsArray = res.data[0].phonetics || [];
      const audioEntry = phoneticsArray.find((p) => p.audio) || null;
      const audio = audioEntry ? audioEntry.audio : null;
      const phonetic = audioEntry ? audioEntry.text : "";

      setMeaning({ mainDefinition, synonyms, antonyms, audio, phonetic });
      setCurrentWord(w);
      addRecentSearch(w);
      toast.success("Meaning fetched!");
    } catch (err) {
      toast.error("Word not found!");
      setMeaning(null);
      setCurrentWord("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-72 bg-white shadow-md h-full p-4 flex flex-col mt-7"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Clock size={18} /> Search History
        </h2>

        {recentSearches.length > 0 ? (
          <ul className="space-y-2 overflow-y-auto flex-1">
            {recentSearches.map((w, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg cursor-pointer"
                onClick={() => fetchMeaning(w)}
              >
                <span>{w}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteWord(w);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm flex-1">No history available</p>
        )}

        {/* Quiz Button */}
        {recentSearches.length > 0 && (
          <button
            onClick={() => navigate("/quiz")}
            className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
          >
            Take Quiz
          </button>
        )}

        {/* Clear All */}
        {recentSearches.length > 0 && (
          <button
            onClick={confirmClearAll}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Clear All
          </button>
        )}
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center mt-16 px-4">
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold ml-4">Dictionary App</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-4"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-semibold mt-10 mb-6"
        >
          Search Word Meaning
        </motion.h1>

        {/* Search Box */}
        <div className="flex gap-2 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter word..."
            className="flex-1 p-3 border rounded-lg outline-none"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <button
            onClick={() => fetchMeaning()}
            className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
          >
            <Search size={22} />
          </button>
        </div>

        {/* Loader */}
        {loading && <p className="mt-4 text-gray-500">Loading...</p>}

        {/* Meaning Box */}
        {meaning && (
          <div className="bg-white p-6 mt-6 rounded-lg shadow w-full max-w-md relative">
            <h2 className="font-bold text-xl">{currentWord}</h2>
            {meaning.audio && (
              <button
                onClick={() => playAudio(meaning.audio)}
                className="bg-blue-200 text-blue-800 px-2 py-1 rounded hover:bg-blue-300 mt-2"
              >
                🔊 Pronounce
              </button>
            )}
            {meaning.phonetic && (
              <span className="text-gray-500 italic mb-4 block">
                {meaning.phonetic}
              </span>
            )}

            <div className="flex items-center gap-2 mb-2">
              <p className="bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm flex-1">
                {meaning.mainDefinition}
              </p>
              <button
                onClick={copyDefinition}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
                title="Copy definition"
              >
                <Copy size={18} />
              </button>
            </div>

            <p className="font-bold mb-1">Synonyms: {meaning.synonyms.join(", ") || "None"}</p>
            <p className="font-bold">Antonyms: {meaning.antonyms.join(", ") || "None"}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-80 text-center">
            <h3 className="text-lg font-semibold mb-3">
              {modalType === "all"
                ? "Clear all search history?"
                : "Delete this word?"}
            </h3>
            <p className="text-gray-500 mb-4">
              {modalType === "all"
                ? "This will permanently remove all history."
                : `Are you sure you want to delete "${deleteTarget}"?`}
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

















