import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/menu.css';
import './css/project_managment.css';

import { Modal } from 'bootstrap';
import Profiles from './Router/ProfileRouter.jsx';
import handleLogout, {Menu_logout} from './Router/LogoutRouter.jsx';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from "react";
import { createPopper } from "@popperjs/core";

function Menu() {
  const INACTIVITY_TIMEOUT = 1800000; 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const inactivityRef = useRef(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityRef.current) {
      clearTimeout(inactivityRef.current);
    }
    
    inactivityRef.current = setTimeout(() => {
      const modalEl = document.getElementById('logoutModal');
      const modal = new Modal(modalEl);
      modal.show();
    }, INACTIVITY_TIMEOUT);
  }, []);

   useEffect(() => {
    resetInactivityTimer();

    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      if (inactivityRef.current) {
        clearTimeout(inactivityRef.current);
      }
    };
  }, [resetInactivityTimer]);

  useEffect(() => {
    if (open && buttonRef.current && menuRef.current) {
      createPopper(buttonRef.current, menuRef.current, {
        placement: "bottom-end",
      });
    }
  }, [open]);

  const toggleDropdown = () => setOpen(!open);

   return (
    <div>
      <header className="navbar bg-white navbar-expand-lg header_sistem">
  <div className="container">
    <div className="d-flex justify-content-between align-items-center w-100">
      <div className="d-flex align-items-center">
        <img className="mx-3 d-none d-md-flex" src="../IMG/Logo.png" alt="Logo" width="80"></img>
        <h1 className="fs-3 my-2">SIMA</h1>
      </div>

    <div className="dropdown ms-auto d-flex align-items-center text-center position-relative">
      <i className="bi bi-bell"></i>
      <i>&nbsp;&nbsp;&nbsp;</i>
      <button
        type="button"
        className="btn btn-link d-flex align-items-center text-center text-black text-decoration-none nav-link dropdown-toggle"
        id="PerfilDropdown"
        onClick={toggleDropdown}
        ref={buttonRef}
      >
        <span id="username" className="me-2 d-none d-md-flex">Nombre Apellido</span>
        <i className="bi bi-person-circle"></i>
      </button>
      <ul
        className={`dropdown-menu dropdown-menu-end conf_user ${open ? 'show' : ''}`}
        ref={menuRef}
        aria-labelledby="PerfilDropdown"
      >
        <li><button className="dropdown-item" ><i className="bi bi-person-fill"></i> Mi Perfil</button></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
      </ul>
    </div>

    </div>
  </div>
      </header>
    <div className="navbar navbar-expand-lg navbar-light sticky-top shadow menu">
            <div className="container-fluid">
              <div className="collapse navbar-collapse" id="menuNav">
                <ul className="navbar-nav mx-auto">
                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/')}>
                      <i className="bi bi-speedometer2"></i> INICIO
                    </button>
                  </li>

                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/projects')}>
                      <i className="bi bi-folder"></i> PROYECTOS
                    </button>
                  </li>

                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/profiles')}>
                      <i className="bi bi-person-lines-fill"></i> PERFILES
                    </button>
                  </li>

                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/reports')}>
                      <i className="bi bi-info-square"></i> REPORTES
                    </button>
                  </li>

                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/calendar')}>
                      <i className="bi bi-calendar"></i> CALENDARIO
                    </button>
                  </li>

                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/users')}>
                      <i className="bi bi-people-fill"></i> USUARIOS
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <main className="container mt-4">
            <Routes>
              <Route path="/" element={<div>Home</div>} />
              <Route path="/projects" element={<div>Projects</div>} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/reports" element={<div>Reports</div>} />
              <Route path="/cal
              sendar" element={<div>Calendar</div>} />
              <Route path="/users" element={<div>Users</div>} />
            </Routes>
          </main>
          <Menu_logout/>
      </div>
      
  )
}


export { Menu };
