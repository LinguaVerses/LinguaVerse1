import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import Firebase just to ensure it initializes, even if we don't use the exports directly here
import './services/firebase'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);