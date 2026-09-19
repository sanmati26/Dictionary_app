import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

const QuizPage = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [answersRecord, setAnswersRecord] = useState([]);

  useEffect(() => {
    const recentWords = JSON.parse(localStorage.getItem("recentWords")) || [];
    if (recentWords.length === 0) {
      toast.error("No words available for quiz");
      navigate("/dashboard");
      return;
    }

    const fetchMeanings = async () => {
      const allData = {};
      for (let word of recentWords) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/meaning/${word}`
          );
          const data = await res.json();
          if (data[0]?.meanings?.[0]?.definitions?.[0]?.definition) {
            allData[word] = data[0].meanings[0].definitions[0].definition;
          }
        } catch (err) {
          console.error("Error fetching meaning", word);
        }
      }

      const qs = Object.keys(allData).map((word) => {
        const correct = allData[word];
        const wrong = Object.values(allData)
          .filter((m) => m !== correct)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        return {
          word,
          correct,
          options: [correct, ...wrong].sort(() => 0.5 - Math.random()),
        };
      });

      setQuestions(qs);
    };

    fetchMeanings();
  }, [navigate]);

  const handleSelect = (option) => {
    setSelectedAnswer(option);
    const currentQuestion = questions[currentIndex];
    const correct = option === currentQuestion.correct;
    if (correct) setScore(score + 1);

    setAnswersRecord([
      ...answersRecord,
      { word: currentQuestion.word, selected: option, correct: currentQuestion.correct },
    ]);

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer("");
      } else {
        setShowResult(true);
      }
    }, 500);
  };

  if (questions.length === 0) return null;

  // Quiz Results
  if (showResult) {
    const percentage = (score / questions.length) * 100;
    let message = "Good effort!";
    if (percentage === 100) message = "Perfect Score! 🎉";
    else if (percentage >= 80) message = "Great job! 🎉";
    else if (percentage >= 50) message = "Keep practicing! 👍";
    else message = "Don't worry! Try again! 💪";

    return (
      <div className="min-h-screen bg-gray-100">
        {/* Navbar */}
        <nav className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold ml-4">Dictionary App Quiz</h1>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-4"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>

        <div className="flex flex-col items-center justify-center p-4 mt-10">
          <div className="bg-white p-6 rounded-lg shadow w-full max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4 text-purple-600">
              {message}
            </h2>
            <p className="text-lg mb-4">
              Your Score:{" "}
              <span className="font-semibold text-blue-600">
                {score} / {questions.length}
              </span>
            </p>
            <h3 className="font-bold text-lg mb-2">Review Answers:</h3>
            <ul className="mb-4 text-left">
              {answersRecord.map((a, i) => (
                <li key={i} className="mb-3 p-2 border rounded">
                  <p className="font-semibold">{a.word}</p>
                  <p>
                    Your Answer:{" "}
                    <span className={a.selected === a.correct ? "text-green-600" : "text-red-600"}>
                      {a.selected}
                    </span>
                  </p>
                  {a.selected !== a.correct && <p>Correct Answer: {a.correct}</p>}
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold ml-4">Dictionary App Quiz</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mr-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>

      {/* Quiz Title */}
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">
        Word Quiz
      </h2>

      {/* Question Card */}
      <div className="flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">
            Question {currentIndex + 1} / {questions.length}
          </h2>
          <p className="text-lg mb-4 font-semibold">{currentQuestion.word}</p>
          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 rounded-lg border text-left ${
                  selectedAnswer === option
                    ? option === currentQuestion.correct
                      ? "bg-green-200 border-green-500"
                      : "bg-red-200 border-red-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;


