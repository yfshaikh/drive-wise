import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const SingleChoiceQuestion = ({ 
  question, 
  options, 
  selectedAnswer, 
  onAnswerSelect 
}) => {
  const theme = useTheme();

  return (
    <Box className="quiz-question" sx={{ p: 4, color: theme.palette.text.primary }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        {question}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {options.map((option) => {
          const isSelected = selectedAnswer === option.value;
          
          return (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => onAnswerSelect(option.value)}
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  p: 2,
                  border: 1,
                  borderColor: isSelected ? theme.palette.primary.main : theme.palette.primary.light,
                  bgcolor: theme.palette.background.paper,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.light,
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box
                    component={motion.div}
                    sx={{
                      width: 20,
                      height: 20,
                      mr: 2,
                      border: 1,
                      borderColor: isSelected ? theme.palette.primary.main : theme.palette.primary.main,
                      borderRadius: '50%', // Changed to circle for radio button style
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'transparent',
                    }}
                  >
                    {isSelected && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        sx={{ 
                          color: theme.palette.primary.main,
                          fontSize: '16px',
                        }}
                      >
                        •
                      </motion.span>
                    )}
                  </Box>
                  <Typography sx={{ color: 'inherit' }}>{option.label}</Typography>
                </Box>
              </Button>
            </motion.div>
          );
        })}
      </Box>
    </Box>
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