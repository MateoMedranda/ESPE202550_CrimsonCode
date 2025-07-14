import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/menu.css';
import './css/project_managment.css';
import Profiles from './Router/ProfileRouter.jsx';
import { useNavigate, Routes, Route } from 'react-router-dom';

function Menu() {
  const navigate = useNavigate();
   return (
    <div>
      <header className="navbar bg-white navbar-expand-lg header_sistem">
  <div className="container">
    <div className="d-flex justify-content-between align-items-center w-100">
      <div className="d-flex align-items-center">
        <img className="mx-3 d-none d-md-flex" src="../IMG/Logo.png" alt="Logo" width="80"></img>
        <h1 className="fs-3 my-2">SIMA</h1>
      </div>

      <div className="dropdown ms-auto d-flex align-items-center text-center">
        <i className="bi bi-bell"></i>
        <i>&nbsp;&nbsp;&nbsp;</i>
        <a className="d-flex align-items-center text-center text-black text-decoration-none nav-link dropdown-toggle"
          id="PerfilDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          <span id="username" className="me-2 d-none d-md-flex">Nombre Apellido</span>
          <i className="bi bi-person-circle"></i>
        </a>
        <ul className="dropdown-menu dropdown-menu-end conf_user" aria-labelledby="PerfilDropdown">
          <li><a className="dropdown-item" href="project_User_Edit.html"><i className="bi bi-person-fill"></i> Mi Perfil</a></li>
          <li><hr className="dropdown-divider"></hr></li>
          <li><a className="dropdown-item text-danger" href="project_login.html">Cerrar Sesión</a></li>
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
              <Route path="/calendar" element={<div>Calendar</div>} />
              <Route path="/users" element={<div>Users</div>} />
            </Routes>
          </main>
      </div>
  )
}


export { Menu };
