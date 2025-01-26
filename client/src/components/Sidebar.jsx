import React, { useState } from "react";
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Home, DirectionsCar, Info, Settings, Google } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [error, setError] = useState(null);
  const { setToken } = useContext(UserContext);


  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const user = {
        first_name: result.user.displayName?.split(' ')[0] || '',
        last_name: result.user.displayName?.split(' ').slice(1).join(' ') || '',
        email: result.user.email,
        photo_url: result.user.photoURL,
        uid: result.user.uid
      };

      const token = await result.user.getIdToken();
      sessionStorage.setItem("token", token);

      if(user){
        const response = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        if(response.ok){
          const data = await response.json();
          console.log(data);
        }
      }

    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error.message);
    }
  };

  const menuItems = [
    { text: "Home", icon: <Home />, path: "/home" },
    { text: "Research cars", icon: <DirectionsCar />, path: "/research" },
    { text: "Compare cars", icon: <Info />, path: "/compare" },
    // { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  return (
    <Drawer variant="permanent" anchor="left">
      <Box
        sx={{
          width: 250,
          height: "100vh",
          bgcolor: "primary.main",
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
          DriveWise
        </Typography>
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: 'pointer',
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              <ListItemIcon sx={{ color: "#ffffff" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    color: "#ffffff"
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            cursor: user ? 'default' : 'pointer',
            '&:hover': {
              bgcolor: user ? 'transparent' : 'primary.dark',
            }
          }}
          onClick={!user ? handleGoogleSignIn : undefined}
        >
          {user ? (
            <>
              <Box
                component="img"
                src={user.photoURL}
                alt="Profile"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%'
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ color: '#ffffff' }}>{user.displayName}</Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#ffffff',
                    opacity: 0.8,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    auth.signOut();
                  }}
                >
                  Sign out
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Google sx={{ color: "#ffffff" }} />
              <Typography sx={{ color: '#ffffff' }}>Sign in with Google</Typography>
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
