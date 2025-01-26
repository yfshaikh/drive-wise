import React, { useState, useContext } from 'react';
import SingleChoiceQuestion from '../components/SingleChoiceQuestion';
import MultiChoiceQuestion from '../components/MultiChoiceQuestion';
import { motion } from 'framer-motion';
import { questions } from '../questions';
import { db } from '../firebase';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function UserInfoQuiz() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  // Modify useEffect to check for existing quiz responses
  React.useEffect(() => {
    if (!token) {
      navigate('/signin');
      return;
    }
    
    try {
      const decoded = jwtDecode(token);
      if (!decoded?.email) {
        navigate('/signin');
        return;
      }

      // Check for existing quiz responses
      const checkQuizResponses = async () => {
        const userDocRef = doc(db, 'users', decoded.email);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists() && docSnap.data().quizResponses) {
          navigate('/home');
        }
      };

      checkQuizResponses();
    } catch (error) {
      console.error('Invalid token:', error);
      navigate('/signin');
    }
  }, [token, navigate]);


  // Add userInfo state
  const [userInfo, setUserInfo] = useState(token ? jwtDecode(token) : null);

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
  const handleSubmit = async () => {
    try {
      if (!userInfo?.email) {
        console.error('No user email found');
        return;
      }

      const answersArray = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }));

      const userDocRef = doc(db, 'users', userInfo.email);
      
      // Check if document exists
      const docSnap = await getDoc(userDocRef);
      
      if (!docSnap.exists()) {
        // Create the document if it doesn't exist
        await setDoc(userDocRef, {
          email: userInfo.email,
          quizResponses: answersArray,
          created_at: new Date()
        });
      } else {
        // Update existing document
        await updateDoc(userDocRef, {
          quizResponses: answersArray
        });
      }

      console.log('Quiz answers saved successfully');
      navigate('/home');
      
    } catch (error) {
      console.error('Error saving quiz answers:', error);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Help Us Find Your Perfect Car</h1>
      
      {currentQuestion < questions.length ? (
        <>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

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
            <div className="flex justify-between mt-6">
              {/* Back Button */}
              <button
                onClick={handleBack}
                // disabled={currentQuestion === 0}
                className={`px-4 py-2 rounded-md ${
                  currentQuestion === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-500 text-white cursor-pointer hover:bg-gray-600'
                } transition-colors`}
              >
                Back
              </button>

              {/* Next/Finish Button */}
              <button
                onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
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