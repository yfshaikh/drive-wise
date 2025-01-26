import React from 'react';
import PropTypes from 'prop-types';

const MultiChoiceQuestion = ({ 
  question, 
  options, 
  selectedAnswers, 
  onAnswerSelect 
}) => {
  const handleSelection = (value) => {
    if (selectedAnswers.includes(value)) {
      onAnswerSelect(selectedAnswers.filter(item => item !== value));
    } else {
      onAnswerSelect([...selectedAnswers, value]);
    }
  };

  return (
    <div className="quiz-question p-4">
      <h3 className="text-lg font-semibold mb-4">{question}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelection(option.value)}
            className={`w-full p-3 text-left border rounded transition-colors
              ${selectedAnswers.includes(option.value) 
                ? 'bg-blue-500 text-white' 
                : 'hover:bg-gray-100'}`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 border rounded mr-3 flex items-center justify-center
                ${selectedAnswers.includes(option.value) ? 'bg-white' : 'bg-transparent'}`}>
                {selectedAnswers.includes(option.value) && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
              {option.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

MultiChoiceQuestion.propTypes = {
  question: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedAnswers: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnswerSelect: PropTypes.func.isRequired,
};

export default MultiChoiceQuestion;