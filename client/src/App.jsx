import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Box } from '@mui/material';
import { UserProvider } from "./context/UserContext";
import { UserContext } from "./context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { jwtDecode } from "jwt-decode";

// PAGES
import LandingPage from "./pages/LandingPage"
import UserInfoQuiz from "./pages/UserInfoQuiz"
import HomePage from "./pages/HomePage"
import CarDetailsPage from "./pages/CarDetailsPage"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import GoogleSignIn from "./components/GoogleSignIn"
import CompareCarsPage from "./pages/CompareCarsPage"

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
    navigate('/');
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
          <Route path="/compare" element={<CompareCarsPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

function AuthWrapper({ children }) {
  const token = sessionStorage.getItem("token");
  let user = null;
  if(token){
    user = jwtDecode(token);
  }
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUserQuiz = async () => {
      if (!token && location.pathname !== '/signin') {
        navigate('/signin');
        return;
      }

      if (token && user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.email));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.quizResponses && location.pathname !== '/') {
              // Redirect to quiz if user hasn't completed it
              navigate('/');
            } else if (userData.quizResponses && location.pathname === '/') {
              // Redirect to home if user has completed the quiz
              navigate('/home');
            }
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      }
    };

    checkUserQuiz();
  }, [token, user, navigate, location]);

  return children;
}

export default App;
