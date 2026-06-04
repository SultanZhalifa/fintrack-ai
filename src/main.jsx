import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Auto-update the PWA: when a new deployment is detected, refresh so users
// always get the latest build without manually clearing the cache.
registerSW({
  immediate: true,
  onNeedRefresh() { window.location.reload() },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
