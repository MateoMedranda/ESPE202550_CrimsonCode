import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import useUserController from "../hooks/UserManager";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UserTable from "../components/User/UserTable";
import UserHeader from "../components/User/UserHeader";
import InformationModal from "../components/User/InformationModal";
import UserRegisterModal from "../components/User/UserRegisterModal";
import UserEditModal from "../components/User/UserEdiModal";

export default function User({ token }) {
  const {
    UserTableGet,
    handleAddUser,
    handleSaveUser,
    handleEditUser,
    handleUpdateUser,
    handleToggleUser,
    profilesContainerRef,
    profilesEditContainerRef,
    loading,
    user,
    message,
    profileData
  } = useUserController(token);
  const { permits } = useAuth();
  const [profiles, setProfiles] = useState([]);

  const canEdit = permits?.Usuarios?.profiles_updateusers?.value === true;
  const canCreate = permits?.Usuarios?.profiles_createusers?.value === true;
  const canView = permits?.Usuarios?.profiles_readusers?.value === true;
  const canDelete = permits?.Usuarios?.profiles_deleteusers?.value === true;
  useEffect(() => {
    UserTableGet();
  }, []);

  const onCancel = (modalname) => {
    const modal = document.getElementById(modalname);
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    }
  };

  const onAddUser = async () => {
    const profilesData = await handleAddUser();
    setProfiles(profilesData || []);
  };

  return (
    <div className="container mt-4 mb-4 p-4">
      <fieldset className="border p-4 shadow agregar bg-light rounded">
        <hr />
        <UserHeader canCreate={canCreate} onAddUser={onAddUser} />
        <hr />

        {canView && (
          <UserTable userdata={user} loading={loading}
            handleEditUser={handleEditUser} handleToggleState={handleToggleUser}
            canEdit={canEdit} canDelete={canDelete}
          />
        )}

        <hr />

        <UserRegisterModal
          onCancel={onCancel} startGoogleAuth={handleSaveUser} profilesContainerRef={profilesContainerRef}
          canCreate={canCreate} 
        />

        <UserEditModal onCancel={onCancel} handleUpdateUser={handleUpdateUser}
          profilesEditContainerRef={profilesEditContainerRef} canEdit={canEdit}
        />

        <InformationModal message={message} />
      </fieldset>
    </div>
  );
}