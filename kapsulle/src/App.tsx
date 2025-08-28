import { Routes, Route } from 'react-router-dom'
import { Landing } from './pages/Landing'
import { Chat } from './pages/Chat' 
import { ThemeProvider } from './contexts/ThemeContext' // Import the provider

function App() {
  return (
    // Wrap the entire application
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App