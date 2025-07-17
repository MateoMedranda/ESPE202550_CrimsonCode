import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Login from './Router/LoginRouter.jsx';
import { Menu } from './App.jsx';
import { MemoryRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
    
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter>
      {localStorage.getItem("token") === null ? <Login /> : <Menu />}
    </MemoryRouter>
  </StrictMode>,
);
