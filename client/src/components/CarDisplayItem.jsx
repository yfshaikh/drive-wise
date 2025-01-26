import React from "react";
import { Card, CardContent, CardMedia, Typography, useTheme, Box } from "@mui/material";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useNavigate } from "react-router-dom";

const CarDisplayItem = ({ image, title, id }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    // Add your compare logic here
    console.log('Compare clicked for car:', id);
  };

  return (
    <Card 
      sx={{
        maxWidth: 345,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardMedia
        component="img"
        image={image}
        alt={title}
        onClick={() => navigate(`/car/${id}`)}
        sx={{
          height: 200,
          objectFit: 'cover',
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          cursor: 'pointer',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      />
      <CardContent
        sx={{
          padding: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // Changed to space-between
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Typography>
          <CompareArrowsIcon 
            onClick={handleCompareClick}
            sx={{ 
              color: theme.palette.primary.main,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              fontSize: '35px',
              padding: '7px',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: theme.palette.grey[500],
                transform: 'scale(1.1)',
              }
            }} 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CarDisplayItem;
