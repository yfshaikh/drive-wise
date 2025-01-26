import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography, useTheme, Box, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CompareIcon from '@mui/icons-material/Compare';
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { jwtDecode } from "jwt-decode";

const CarDisplayItem = ({ image, title, id }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const token = sessionStorage.getItem("token");

  if(!token){
    navigate('/signin');
    return;
  }

  const userInfo = jwtDecode(token);

  const handleCompareIconClick = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleCompareClick = async () => {
    try {


      // Format the car title (assuming format is "Year Model")
      const formattedCarId = title.toLowerCase().replace(/ /g, '_');

      // Reference to user's document
      const userDocRef = doc(db, 'users', userInfo.email);
      
      // Get current comparison list
      const userDoc = await getDoc(userDocRef);
      const currentComparisons = userDoc.data()?.comparisons || [];

      // Check if car is already in comparison list
      if (currentComparisons.includes(formattedCarId)) {
        console.log('Car already in comparison list');
        return;
      }

      // Add car to comparison list
      await updateDoc(userDocRef, {
        comparisons: arrayUnion(formattedCarId)
      });

      console.log('Added to comparison:', formattedCarId);
    } catch (error) {
      console.error('Error adding car to comparison:', error);
    } finally {
      handleClose();
    }
  };

  return (
    <>
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
            <Tooltip title="Add to comparison" arrow>
              <CompareIcon 
                onClick={handleCompareIconClick}
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
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Add to Comparison"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Would you like to add {title} to your comparison list?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCompareClick} color="primary" autoFocus>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CarDisplayItem;
