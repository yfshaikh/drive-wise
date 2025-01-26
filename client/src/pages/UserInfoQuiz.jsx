import React, { useState } from 'react';
import { SingleChoiceQuestion, MultiChoiceQuestion } from '../components';

function UserInfoQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'demographics',
      type: 'single',
      question: 'Which best describes your current life stage?',
      options: [
        { value: 'young_single', label: 'Young Professional (Single)' },
        { value: 'married_no_kids', label: 'Married/Partner (No Children)' },
        { value: 'family_young_kids', label: 'Family with Young Children' },
        { value: 'family_teens', label: 'Family with Teenagers' },
        { value: 'empty_nester', label: 'Empty Nester' }
      ]
    },
    {
      id: 'age',
      type: 'single',
      question: 'What is your age range?',
      options: [
        { value: '18-25', label: '18-25 years' },
        { value: '26-35', label: '26-35 years' },
        { value: '36-45', label: '36-45 years' },
        { value: '46-55', label: '46-55 years' },
        { value: '56+', label: '56 years or older' }
      ]
    },
    {
      id: 'household_income',
      type: 'single',
      question: 'What is your annual household income?',
      options: [
        { value: 'under_50k', label: 'Under $50,000' },
        { value: '50k-75k', label: '$50,000 - $75,000' },
        { value: '75k-100k', label: '$75,000 - $100,000' },
        { value: '100k-150k', label: '$100,000 - $150,000' },
        { value: 'over_150k', label: 'Over $150,000' }
      ]
    },
    {
      id: 'credit_score',
      type: 'single',
      question: 'What is your credit score range?',
      options: [
        { value: 'excellent', label: 'Excellent (750+)' },
        { value: 'good', label: 'Good (700-749)' },
        { value: 'fair', label: 'Fair (650-699)' },
        { value: 'poor', label: 'Poor (Below 650)' },
        { value: 'unsure', label: 'Not Sure' }
      ]
    },
    {
      id: 'monthly_payment',
      type: 'single',
      question: 'What is your target monthly car payment?',
      options: [
        { value: 'under_300', label: 'Under $300' },
        { value: '300-500', label: '$300 - $500' },
        { value: '500-700', label: '$500 - $700' },
        { value: '700-900', label: '$700 - $900' },
        { value: 'over_900', label: 'Over $900' }
      ]
    },
    {
      id: 'primary_use',
      type: 'multiple',
      question: 'What will be the primary uses for your vehicle? (Select all that apply)',
      options: [
        { value: 'commute', label: 'Daily Commute' },
        { value: 'family', label: 'Family Transportation' },
        { value: 'recreation', label: 'Weekend Recreation' },
        { value: 'business', label: 'Business/Professional' },
        { value: 'road_trips', label: 'Long Distance Travel' }
      ]
    },
    {
      id: 'vehicle_type',
      type: 'multiple',
      question: 'What vehicle categories interest you? (Select all that apply)',
      options: [
        { value: 'luxury', label: 'Luxury Vehicle' },
        { value: 'sports', label: 'Sports Car' },
        { value: 'suv', label: 'SUV/Crossover' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'electric', label: 'Electric Vehicle' }
      ]
    },
    {
      id: 'priorities',
      type: 'multiple',
      question: 'What are your top priorities in a vehicle? (Select all that apply)',
      options: [
        { value: 'comfort', label: 'Comfort and Ride Quality' },
        { value: 'performance', label: 'Performance and Handling' },
        { value: 'safety', label: 'Safety Features' },
        { value: 'fuel_efficiency', label: 'Fuel Efficiency' },
        { value: 'tech_features', label: 'Technology Features' }
      ]
    },
    {
      id: 'tech_features',
      type: 'multiple',
      question: 'Which technology features are important to you? (Select all that apply)',
      options: [
        { value: 'apple_carplay', label: 'Apple CarPlay/Android Auto' },
        { value: 'driver_assist', label: 'Advanced Driver Assistance' },
        { value: 'premium_audio', label: 'Premium Audio System' },
        { value: 'parking_assist', label: 'Parking Assistance' },
        { value: 'wireless_charging', label: 'Wireless Charging' }
      ]
    },
    {
      id: 'color_preference',
      type: 'multiple',
      question: 'What are your preferred exterior colors? (Select all that apply)',
      options: [
        { value: 'black', label: 'Black' },
        { value: 'white', label: 'White' },
        { value: 'silver', label: 'Silver/Gray' },
        { value: 'blue', label: 'Blue' },
        { value: 'red', label: 'Red' }
      ]
    }
  ];

  const handleAnswer = (answer) => {
    const currentQ = questions[currentQuestion];
    if (currentQ.type === 'single') {
      setAnswers({ ...answers, [currentQ.id]: answer });
    } else {
      setAnswers({ ...answers, [currentQ.id]: answer });
    }
    // Remove auto-advancement here
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
            <div className="text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <button
              onClick= {handleNext }
              disabled={!answers[currentQ.id]}
              className={`px-6 py-2 rounded transition-colors ${
                answers[currentQ.id]
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
          </>
      ) : (
        <div className="text-center">
          <h2 className="text-xl mb-4">Thank you for completing the quiz!</h2>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Get Car Recommendations
          </button>
        </div>
      )}
    </div>
  );
}

export default UserInfoQuiz;