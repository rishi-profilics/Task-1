import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ActivityProvider } from './context/activity-context.jsx'
import { StyledEngineProvider } from '@mui/material/styles'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ActivityProvider>
      <StyledEngineProvider>
        <App />
      </StyledEngineProvider>
    </ActivityProvider>
    </BrowserRouter>
  </StrictMode>,
)
