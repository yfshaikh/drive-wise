import React, { useState } from 'react';
import SingleChoiceQuestion from '../components/SingleChoiceQuestion';
import MultiChoiceQuestion from '../components/MultiChoiceQuestion';
import { motion } from 'framer-motion';
import { questions } from '../questions';

function UserInfoQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});


  const handleAnswer = (answer) => {
    const currentQ = questions[currentQuestion];
    if (currentQ.type === 'single') {
      setAnswers({ ...answers, [currentQ.id]: answer });
    } else {
      setAnswers({ ...answers, [currentQ.id]: answer });
    }
    // Remove auto-advancement here
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const handleSubmit = () => {
    // Here you would send the answers to your backend/agents
    console.log('Quiz answers:', answers);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Help Us Find Your Perfect Car</h1>
      
      {currentQuestion < questions.length ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentQ.type === 'single' ? (
              <SingleChoiceQuestion
                question={currentQ.question}
                options={currentQ.options}
                selectedAnswer={answers[currentQ.id]}
                onAnswerSelect={handleAnswer}
              />
            ) : (
              <MultiChoiceQuestion
                question={currentQ.question}
                options={currentQ.options}
                selectedAnswers={answers[currentQ.id] || []}
                onAnswerSelect={handleAnswer}
              />
            )}
  
            {/* Navigation section */}
            <div className="flex items-center justify-between mt-6">
              {/* Back Button */}
              <button
                onClick={handleBack}
                disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600'
                } transition-colors`}
              >
                Back
              </button>
  
              {/* Question Counter */}
              <div className="text-gray-500">
                Question {currentQuestion + 1} of {questions.length}
              </div>
  
              {/* Next/Finish Button */}
              <button
                onClick={handleNext}
                disabled={!answers[currentQ.id]}
                className={`px-6 py-2 rounded-md transition-colors ${
                  answers[currentQ.id]
                    ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl mb-4">Thank you for completing the quiz!</h2>
          <motion.button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            Get Car Recommendations
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default UserInfoQuiz;