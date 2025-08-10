import React from "react";
import { useAuth } from "../Context/AuthContext";
const ActionDropdown = ({ onEdit, onDelete, onView, customItems = [] }) => {
    const { token, permits } = useAuth();
    const canView   = permits?.["Planes Ambientales"]?.profiles_readambientalplans?.value === true;
    const canCreate = permits?.["Planes Ambientales"]?.profiles_createambientalplans?.value === true;
    const canUpdate = permits?.["Planes Ambientales"]?.profiles_updateambientalplans?.value === true;
    const canDelete = permits?.["Planes Ambientales"]?.profiles_deleteambientalplans?.value === true;
    return (
        <div className="dropdown">
            <div
                className="project_options rounded"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                role="button"
            >
                <h2 className="mb-0"><i className="bi bi-list"></i></h2>
            </div>
            <ul className="dropdown-menu dropdown-menu-end shadow">
                {onEdit && (
                    canUpdate && (
                    <li>
                        
                            <button className="dropdown-item" onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(e);
                        }}>
                            Editar
                        </button>
                        
                    </li>
                    )
                )}
                {onDelete && (
                    canDelete && (
                    <li>
                        {}
                        <button className="dropdown-item" onClick={onDelete}>
                            Eliminar
                        </button>
                    </li>
                    )
                )}
                {onView && (
                    canView && (
                    <li>
                        <button className="dropdown-item" onClick={onView}>
                            Ver detalles
                        </button>
                    </li>
                    )
                )}
                {customItems.length > 0 && customItems.map((item, index) => (
                    <li key={index}>
                        <button className="dropdown-item" onClick={item.onClick}>
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ActionDropdown;
