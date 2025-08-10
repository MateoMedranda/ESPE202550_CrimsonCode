import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/menu.css';
import './css/project_managment.css';
import './css/project_page.css';

import { Modal, Collapse } from 'bootstrap';
import Profiles from './Router/ProfileRouter.jsx';
import Users from './Router/UserRouter.jsx';
import Calendar from './Router/CalendarRouter.jsx';
import handleLogout, { Menu_logout } from './Router/LogoutRouter.jsx';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from "react";
import { createPopper } from "@popperjs/core";
import Projects from './Router/ProjectDetailRouter.jsx';
import EnvironmentalPlanDetail from './Router/EnvironmentalPlanDetail.jsx';
import HomePage from './Router/HomePage.jsx';
import EnvironmentalCharts from './Router/ReportsRouter.jsx';
import ProfileForm from './Router/InformationUser.jsx';
import ProjectsRouter from './Router/ProjectRouter.jsx';
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
    <Routes>
      {isAuthenticated && (
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route
            path="/projects/:projectId/plans/:planId"
            element={<EnvironmentalPlanDetail />}
          />
          <Route path="/profiles" element={<Profiles />} />
          <Route path="/reports" element={<EnvironmentalCharts planId={2} />} />
          <Route path="/calendar" element={<CalendarRouter />} />
          <Route path="/users" element={<User />} />
          <Route path="/userInfo" element={<ProfileForm />} />
        </Route>
      )}
      <Route path="/login" element={<Login />} />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/" : "/login"} />}
      />
    </Routes>
  );
}


export default App;
