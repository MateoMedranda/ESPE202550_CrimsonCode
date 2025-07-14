import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './Router/LoginRouter.jsx';  
import  {Menu}  from './App.jsx';
import { MemoryRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MemoryRouter>
      {localStorage.getItem("token") === null ? <Login /> : <Menu />}
    </MemoryRouter>
  </StrictMode>,
)
