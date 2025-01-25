import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

// PAGES
import LandingPage from "./pages/LandingPage"
import UserInfoQuiz from "./pages/UserInfoQuiz"
function App() {

  return (
    <>
      <Router>
        <div className="app">
          <Routes>
            <Route path = '/' element={<LandingPage />} />
            <Route path = '/quiz' element={<UserInfoQuiz />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
