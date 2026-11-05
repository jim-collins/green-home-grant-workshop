import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './App.css';
import { getBasename } from './utils/basename';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={getBasename(window.location.pathname)}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
