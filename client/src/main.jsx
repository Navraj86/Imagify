import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import AppContextProvider from './context/AppContext';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <Router>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </Router>
)
