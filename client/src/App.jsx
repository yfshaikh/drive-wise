import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';
import { Box } from '@mui/material';
// PAGES
import LandingPage from "./pages/LandingPage"
import UserInfoQuiz from "./pages/UserInfoQuiz"
import HomePage from "./pages/HomePage"
import CarDetailsPage from "./pages/CarDetailsPage"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
          {/* <Navbar /> */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              ml: "250px", // To offset the content for the sidebar width
            }}
          >
          <Routes>
            <Route path = '/' element={<HomePage />} />
            <Route path = '/quiz' element={<UserInfoQuiz />} />
            <Route path = '/car/:id' element={<CarDetailsPage />} />
          </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  )
}

export default App
