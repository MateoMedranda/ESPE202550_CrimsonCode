import React from "react";

const ConfirmDeleteModal = ({
    show,
    onClose,
    onConfirm,
    entityName = "elemento",
    entityLabel = "",
}) => {
    if (!show) return null;

    return (
        <div className="modal d-block bg-dark bg-opacity-50" onClick={onClose}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                    <div className="modal-header bg-danger text-white">
                        <h5>¿Eliminar {entityLabel || entityName}?</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        ¿Estás seguro de eliminar {entityLabel || `este ${entityName}`}?
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button className="btn btn-danger" onClick={onConfirm}>
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;
