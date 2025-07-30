import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/menu.css';
import './css/project_managment.css';
import './css/project_page.css';

import { Modal,Collapse } from 'bootstrap';
import Profiles from './Router/ProfileRouter.jsx';
import Users from './Router/UserRouter.jsx';
import Calendar from './Router/CalendarRouter.jsx';
import handleLogout, {Menu_logout} from './Router/LogoutRouter.jsx';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from "react";
import { createPopper } from "@popperjs/core";
import Projects from './Router/ProjectDetailRouter.jsx';
import EnvironmentalPlanDetail from './Router/EnvironmentalPlanDetail.jsx';
import HomePage from './Router/HomePage.jsx';

function Menu() {
  const INACTIVITY_TIMEOUT = 1800000; 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const inactivityRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [userSurName, setUserSurName] = useState("");
  const [userID, setUserID] = useState("");
  const [userProfileID, setProfileID] = useState("");
  const [token, setToken] = useState("");
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
    const user = JSON.parse(localStorage.getItem("user"));
    const tokenVal = localStorage.getItem("token"); 
    if (user && user.name && user.surname && user.id && user.profile_id && tokenVal) {
      setUserName(user.name);
      setUserSurName(user.surname);
      setUserID(user.id);
      setProfileID(user.profile_id);
      setToken(tokenVal);
    } else {
      setUserName("");  
      setUserSurName("");
      setUserID("");
      setProfileID("");
      setToken("");
    }
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

  
  useEffect(() => {
    const collapseElement = document.getElementById('menuNav');
    if (collapseElement) {
      new Collapse(collapseElement, { toggle: false });
    }
  }, []);

  const toggleNavbar = () => {
  const collapseElement = document.getElementById('menuNav');
  if (!collapseElement) return;

  const instance = Collapse.getOrCreateInstance(collapseElement);
  if (collapseElement.classList.contains('show')) {
    instance.hide();
  } else {
    instance.show();
  }
};


  const toggleDropdown = () => setOpen(!open);

   return (
    <div>
      <header className="navbar bg-white navbar-expand-lg header_sistem">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex align-items-center">
              <img className="mx-3 d-none d-md-flex" src="../img/Logo.png" alt="Logo" width="80" />
              <h1 className="fs-3 my-2">SIMA</h1>
            </div>


            {/* Perfil */}
            <div className="dropdown ms-2 d-flex align-items-center text-center position-relative">
              <i className="bi bi-bell me-3"></i>
              <button
                type="button"
                className="btn btn-link d-flex align-items-center text-black text-decoration-none nav-link dropdown-toggle"
                id="PerfilDropdown"
                onClick={toggleDropdown}
                ref={buttonRef}
              >
                <span id="username" className="me-2 d-sm-inline">{userName + " " + userSurName}</span>
                <i className="bi bi-person-circle"></i>
              </button>
              <ul
                className={`dropdown-menu dropdown-menu-end conf_user ${open ? 'show' : ''}`}
                ref={menuRef}
                aria-labelledby="PerfilDropdown"
              >
                <li><button className="dropdown-item"><i className="bi bi-person-fill"></i> Mi Perfil</button></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Cerrar Sesión</button></li>
              </ul>
            </div>
          </div>
        </div>
      </header>

    <div className="navbar navbar-expand-lg navbar-light sticky-top shadow menu">
      <div className="container-fluid">
        {/* Botón hamburguesa para colapsar en móviles */}
                <button className="navbar-toggler"  type="button" data-bs-target="#menuNav"
      aria-controls="menuNav" aria-expanded="false" aria-label="Toggle navigation" onClick={toggleNavbar}>
      <span className="navbar-toggler-icon"></span>
    </button>
        <div className="collapse navbar-collapse" id="menuNav">
          <ul className="navbar-nav mx-auto">
                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/')}>
                      <i className="bi bi-speedometer2"></i> INICIO
                    </button>
                  </li>

                  <li className="nav-item opcion fw-bold mx-2">
                    <button className="nav-link btn" onClick={() => navigate('/projects/1')}>
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
            <Route path="/" element={<HomePage />} />
              <Route path="/projects/:projectId" element={<Projects token={token}/>} />
              <Route path="/projects/:projectId/plans/:planId" element={<EnvironmentalPlanDetail token={token} />} />
              <Route path="/profiles" element={<Profiles token={token} />} />
              <Route path="/reports" element={<div>Reports</div>} />
              <Route path="/calendar" element={<Calendar token={token}/>} />
              <Route path="/users" element={<Users token={token}/>} />
            </Routes>
          </main>
          <Menu_logout/>
          
      </div>
      
  )
}


export { Menu };
