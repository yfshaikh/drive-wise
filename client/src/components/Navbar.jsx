import React from "react";
import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link } from "react-router-dom"; 

const Navbar = () => {
  return (
    <AppBar position="sticky" className="bg-gray-800 shadow-lg">
      <Toolbar className="flex justify-between items-center py-4">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-2 no-underline">
          <div className="w-15 h-10">
            <img src="/toyota.png" alt="DriveWise Logo" className="w-full h-full object-cover" />
          </div>
          <Typography variant="h5" className="!text-white font-bold">
            DriveWise
          </Typography>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex space-x-4">
          <Button 
            component={Link} 
            to="/" 
            className="text-white hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Home
          </Button>
          <Button 
            component={Link} 
            to="/about" 
            className="!text-white hover:bg-gray-700 px-4 py-2 rounded-md"
          >
            Compare
          </Button>
        </div>

        {/* Hamburger Menu for mobile */}
        <div className="md:hidden">
          <Button
            className="text-white hover:bg-gray-700 p-2 rounded-md"
            onClick={() => alert("Open mobile menu")}
          >
            <span className="material-icons">menu</span>
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
