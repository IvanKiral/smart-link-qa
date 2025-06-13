import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SmartLinkProvider } from './contexts/SmartLinkContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SmartLinkProvider>
      <App />
    </SmartLinkProvider>
  </StrictMode>,
)
