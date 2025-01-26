import React from 'react';
import PropTypes from 'prop-types';

const SingleChoiceQuestion = ({ 
  question, 
  options, 
  selectedAnswer, 
  onAnswerSelect 
}) => {
  return (
    <div className="quiz-question p-4">
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswerSelect(option.value)}
            className={`w-full p-3 text-left border rounded transition-colors
              ${selectedAnswer === option.value 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

SingleChoiceQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedAnswer: PropTypes.string,
  onAnswerSelect: PropTypes.func.isRequired,
};

export default SingleChoiceQuestion;