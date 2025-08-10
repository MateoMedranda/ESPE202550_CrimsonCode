import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/menu.css';
import './css/project_managment.css';
import './css/project_page.css';

import { Modal, Collapse } from 'bootstrap';
import Profiles from './pages/ProfileRouter.jsx';
import Users from './pages/UserRouter.jsx';
import Calendar from './pages/CalendarRouter.jsx';
import Menu_logout  from './pages/LogoutRouter.jsx';
import {handleLogout} from './pages/LogoutRouter.jsx';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from "react";
import { createPopper } from "@popperjs/core";
import Projects from './pages/ProjectDetailRouter.jsx';
import EnvironmentalPlanDetail from './pages/EnvironmentalPlanDetail.jsx';
import HomePage from './pages/HomePage.jsx';
import EnvironmentalCharts from './pages/ReportsRouter.jsx';
import ProfileForm from './pages/InformationUser.jsx';
import ProjectsRouter from './pages/ProjectRouter.jsx';
import { useAuth } from "./Context/AuthContext";

function Menu() {
  const INACTIVITY_TIMEOUT = 1800000;
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const inactivityRef = useRef(null);
  const { user, token } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = user?.name || "";
  const userSurName = user?.surname || "";

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

  const isActive = (path) => {
    if (path === "/projects/1") {
      return location.pathname.startsWith("/projects");
    }
    return location.pathname === path;
  };

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
                <li><button className="dropdown-item" onClick={() => navigate("/userInfo")}><i className="bi bi-person-fill"></i> Mi Perfil</button></li>
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
          <button
            className="navbar-toggler"
            type="button"
            data-bs-target="#menuNav"
            aria-controls="menuNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="menuNav">
            <ul className="navbar-nav mx-auto">
              <li className={`nav-item opcion fw-bold mx-2 ${isActive('/') ? 'active-menu' : ''}`}>
                <button className="nav-link btn d-flex align-items-center" onClick={() => navigate('/')}>
                  <i className="bi bi-speedometer2"></i> INICIO
                  {isActive('/') && <span className="active-circle ms-2"></span>}
                </button>
              </li>

              <li className={`nav-item opcion fw-bold mx-2 ${isActive('/projects/1') ? 'active-menu' : ''}`}>
                <button className="nav-link btn d-flex align-items-center" onClick={() => navigate('/projects')}>
                  <i className="bi bi-folder"></i> PROYECTOS
                  {isActive('/projects/1') && <span className="active-circle ms-2"></span>}
                </button>
              </li>

              <li className={`nav-item opcion fw-bold mx-2 ${isActive('/reports') ? 'active-menu' : ''}`}>
                <button className="nav-link btn d-flex align-items-center" onClick={() => navigate('/reports')}>
                  <i className="bi bi-info-square"></i> REPORTES
                  {isActive('/reports') && <span className="active-circle ms-2"></span>}
                </button>
              </li>

              <li className={`nav-item opcion fw-bold mx-2 ${isActive('/calendar') ? 'active-menu' : ''}`}>
                <button className="nav-link btn d-flex align-items-center" onClick={() => navigate('/calendar')}>
                  <i className="bi bi-calendar"></i> CALENDARIO
                  {isActive('/calendar') && <span className="active-circle ms-2"></span>}
                </button>
              </li>

              <li className={`nav-item opcion fw-bold mx-2 ${isActive('/users') ? 'active-menu' : ''}`}>
                <button className="nav-link btn d-flex align-items-center" onClick={() => navigate('/users')}>
                  <i className="bi bi-people-fill"></i> USUARIOS
                  {isActive('/users') && <span className="active-circle ms-2"></span>}
                </button>
              </li>
                            <li className={`nav-item opcion fw-bold mx-2 ${isActive('/profiles') ? 'active-menu' : ''}`}>
                <button className="nav-link btn d-flex align-items-center" onClick={() => navigate('/profiles')}>
                  <i className="bi bi-person-lines-fill"></i> PERFILES
                  {isActive('/profiles') && <span className="active-circle ms-2"></span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsRouter token={token}/>} />
          <Route path="/projects/:projectId" element={<Projects token={token} />} />
          <Route path="/projects/:projectId/plans/:planId" element={<EnvironmentalPlanDetail token={token} />} />
          <Route path="/profiles" element={<Profiles token={token} />} />
          <Route path="/reports" element={<EnvironmentalCharts planId={2} token={token} />} />
          <Route path="/calendar" element={<Calendar token={token} />} />
          <Route path="/users" element={<Users token={token} />} />
          <Route path="/userInfo" element={<ProfileForm/>} />
        </Routes>
      </main>
      <Menu_logout />
    </div>
  );
}

export { Menu };
