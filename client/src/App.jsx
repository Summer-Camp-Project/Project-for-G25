import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './pages/Home'
import Auth from './pages/Auth'
import ContactUs from './pages/ContactUs'
import './styles/global.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <Routes>
          <Route path="/" element={
            <>
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/auth" element={<Auth darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/contact" element={
            <>
              <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <ContactUs />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
