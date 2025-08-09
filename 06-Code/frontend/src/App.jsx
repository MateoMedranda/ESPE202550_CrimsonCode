import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout.jsx";

import HomePage from "./pages/HomePage.jsx";
import ProjectList from "./pages/ProjectRouter.jsx";
import ProjectDetail from "./pages/ProjectDetailRouter.jsx";
import EnvironmentalPlanDetail from "./pages/EnvironmentalPlanDetail.jsx";
import Profiles from "./pages/ProfileRouter.jsx";
import ProfileForm from "./pages/InformationUser.jsx";
import EnvironmentalCharts from "./pages/ReportsRouter.jsx";
import CalendarRouter from "./pages/CalendarRouter.jsx";
import User from "./pages/UserRouter.jsx";
import Login from "./pages/LoginRouter.jsx";

function App() {
  const { token, loading } = useAuth();
  const isAuthenticated = !!token;

  if (loading) {
    return <div className="p-4">Cargando...</div>; // o tu pantalla de carga
  }

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
