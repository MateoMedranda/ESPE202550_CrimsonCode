import CalendarManager from "../hooks/CalendarManager";
import { useState,useEffect, useRef} from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


export default function CalendarRouter() {
    const{
        CalendarContentGet,
        notificationPost,
        notifications, 
        notification,
        projects,
        projectsRef,
        message,
        handleAddNotification,
        handleSaveNotification
    } = CalendarManager(sessionStorage.getItem('token'));

    const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
  setLoading(false); 
}, []);

const handleDatesSet = async (info) => {
    const visibleDate = info.view.currentStart;
    const firstDayOfMonth = new Date(
    visibleDate.getFullYear(),
    visibleDate.getMonth(),
    1
  );

  const data = await CalendarContentGet(firstDayOfMonth);

    const eventsFormatted = data.map(evt => ({
        id: evt.id,
        title: evt.title,
        start: evt.reminder_date,
    }));

    setEvents(eventsFormatted);
    };

    const onCancel = (modalname) => {
    const modal = document.getElementById(modalname);  
    if (modal) {
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      document.body.style.paddingRight = "";
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    }
  }

  return (
    <div className="container mt-4">
         <fieldset className="border p-4 shadow agregar bg-light rounded">
        <div className="text-center bg-success-subtle">
          <h2 className="title">
            <b>Calendario</b>
          </h2>
        </div>
        <hr />
        <div className="d-flex justify-content-end">
          <button
            className="btn_add btn bg-info-subtle border-black"
            onClick={handleAddNotification}
          >
            <i className="bi bi-plus-circle"></i> Agregar Notificación
          </button>
        </div>
        <hr />
        <div className="container">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                datesSet={handleDatesSet}
                locale="es"
                height="auto"
                eventDidMount={(info) => {
                    info.el.setAttribute('title', info.event.title);
                }}
            />
        </div>
      </fieldset>
      
      <div className="modal fade" id="register_notification" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="container">
              <h1 className="text-center">Registrar Nueva Notificación</h1>
              <div className="row border border-dark p-3 my-4 mx-4">
                <div className="col-md-8">
                  <label htmlFor="notification_title" className="form-label">
                    Titulo de la Notificación:
                  </label>
                  <input type="text" id="notification_title" className="form-control border-dark"/>
                  <label htmlFor="notification_date" className="form-label">
                    Fecha de la Notificación:
                  </label>
                  <input type="date" id="notification_date" className="form-control border-dark"  min={new Date().toISOString().split("T")[0]} />
                  <label htmlFor="notification_description" className="form-label">
                    Descripción de la Notificación:
                  </label>
                  <input type="text" id="notification_description" className="form-control border-dark"/>
                </div>
              </div>
              <div className="row border border-dark p-5 my-4 mx-4">
                <h2>Proyecto Anexo</h2>
                <div className="col-md-12">
                    <select className="form-select border-dark" id="project_select" ref={projectsRef}>   
                  {loading ? (
                    <option value="loading" disabled>
                      Cargando...
                    </option>
                  ) : projects.length === 0 ? (
                    <option value="none" disabled>
                      No existen proyectos
                    </option>)
                    :(
                    <option value="seleccione">Seleccione...</option>
                    )}
                    </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-white border-dark"
                  data-bs-dismiss="modal"
                  onClick={() => onCancel('register_notification')}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-white border-dark"
                  onClick={handleSaveNotification}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Information container */}
      <div className="modal fade" id="information_container" tabIndex="-1" aria-labelledby="information_container" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg my-5">
        <div className="modal-content my-5">
          <div className="container my-5">
            <div className="row">
              <h1 className="text-center" id="message">
                {message}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}