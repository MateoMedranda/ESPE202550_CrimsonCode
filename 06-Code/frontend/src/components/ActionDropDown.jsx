import React from "react";

const ActionDropdown = ({ onEdit, onDelete, onView, customItems = [] }) => {
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
                    <li>
                        <button className="dropdown-item" onClick={(e) => {
                            e.stopPropagation();
                            onEdit && onEdit(e);
                        }}>
                            Editar
                        </button>

                    </li>
                )}
                {onDelete && (
                    <li>
                        <button className="dropdown-item" onClick={onDelete}>
                            Eliminar
                        </button>
                    </li>
                )}
                {onView && (
                    <li>
                        <button className="dropdown-item" onClick={onView}>
                            Ver detalles
                        </button>
                    </li>
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
