import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App'
import { Toaster } from '@/components/ui/sonner'
import "bootstrap-icons/font/bootstrap-icons.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster/>
  </StrictMode>,
)
