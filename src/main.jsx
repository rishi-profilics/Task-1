import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ActivityProvider } from './context/activity-context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ActivityProvider>
      <App />
    </ActivityProvider>
    </BrowserRouter>
  </StrictMode>,
)
