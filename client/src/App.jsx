import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

// PAGES
import LandingPage from "./pages/LandingPage"

function App() {

  return (
    <>
      <Router>
        <div className="app">
          <Routes>
            <Route path = '/' element={<LandingPage />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
