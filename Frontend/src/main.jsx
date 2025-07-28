import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './store/store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store = {store}>

    <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
