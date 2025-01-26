import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Box } from '@mui/material';
import { UserProvider } from "./context/UserContext";
import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// PAGES
import LandingPage from "./pages/LandingPage"
import UserInfoQuiz from "./pages/UserInfoQuiz"
import HomePage from "./pages/HomePage"
import CarDetailsPage from "./pages/CarDetailsPage"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import GoogleSignIn from "./components/GoogleSignIn"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <UserProvider>
          <AuthWrapper>
            <AppContent />
          </AuthWrapper>
        </UserProvider>
      </Router>
    </ThemeProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const showSidebar = location.pathname !== '/' && location.pathname !== '/signin';

  const handleSignInSuccess = (user) => {
    console.log("User signed in successfully:", user);
    navigate('/home');
  };

  return (
    <Box sx={{ display: "flex" }}>
      {showSidebar && <Sidebar />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: showSidebar ? "250px" : 0,
        }}
      >
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/" element={<UserInfoQuiz />} />
          <Route path="/car/:id" element={<CarDetailsPage />} />
          <Route path="/signin" element={<GoogleSignIn onSignInSuccess={handleSignInSuccess}/>} />
        </Routes>
      </Box>
    </Box>
  );
}

function AuthWrapper({ children }) {
  const token = sessionStorage.getItem("token");
  console.log("APP TOKEN");
  console.log(token);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("APP TOKEN");
    console.log(token);
    if (!token && location.pathname !== '/signin') {
      navigate('/signin');
    }
  }, [token, navigate, location]);

  return children;
}

export default App;
