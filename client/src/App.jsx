import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './theme';

// PAGES
import LandingPage from "./pages/LandingPage"
import UserInfoQuiz from "./pages/UserInfoQuiz"
import HomePage from "./pages/HomePage"
import CarDetailsPage from "./pages/CarDetailsPage"
import Navbar from "./components/Navbar"

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path = '/' element={<HomePage />} />
            <Route path = '/quiz' element={<UserInfoQuiz />} />
            <Route path = '/car/:id' element={<CarDetailsPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
