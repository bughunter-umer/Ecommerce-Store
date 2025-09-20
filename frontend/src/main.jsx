import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';
import './styles/index.css';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from "react-router-dom";



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    <AuthProvider>
    <App />
    <ToastContainer/>
    </AuthProvider>
    </BrowserRouter>
  </Provider>
);
