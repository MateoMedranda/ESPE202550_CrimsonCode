import { useRef, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
import '../../css/calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
export default function CalendarManager(token) {
    const calendarRef = useRef(null);
    const [beforeNotification, setBeforeNotification] = useState(null);
    const [projects, setProjects] = useState([]);
    const projectsRef = useRef([]);
    const [message, setMessage] = useState("");
    const [notification, setNotification] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const CalendarContentGet = async (date) => {
        const dateOnly = date.toISOString().split("T")[0];

        const response = await fetch("http://localhost:3001/api/reminder/all", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date: dateOnly }),
        });

        const data = await response.json();
        return data;
    };

    const notificationPost = async (data) => {

    }

    const handleAddNotification = async () => {
        setLoading(true);
            try {
                const response = await fetch('http://localhost:3001/projects', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`,
                },
                });
        
                if (!response.ok) throw new Error("Error en la respuesta del servidor");
        
                const data = await response.json();

                const selectElement = projectsRef.current;
                if (selectElement) {
                selectElement.innerHTML = '<option value="seleccione">Seleccione...</option>';
                data.forEach((project) => {
                    const option = document.createElement("option");
                    option.value = project.project_id;
                    option.textContent = project.project_name;
                    selectElement.appendChild(option);
                });
                }
        
            } catch (error) {
                console.error("Error cargando los proyectos:", error);
                handleMessage("Error al obtener los datos de los proyectos.");
            } finally {
                setLoading(false);
                    const modalEl = document.getElementById("register_notification");
                    const modal = new bootstrap.Modal(modalEl);
                    modal.show();
            }
        
    }
    
    const handleSaveNotification = async () => {
    const projectSelect = document.getElementById("project_select");
    const projectId = projectSelect.value;
    const notificationDate = document.getElementById("notification_date").value;
    const notificationTitle = document.getElementById("notification_title").value;
    const notificationDescription = document.getElementById("notification_description").value;

    if (!projectId || !notificationDate || !notificationDescription || !notificationTitle) {
        handleMessage("Por favor, complete todos los campos.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/reminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: notificationTitle,
                date: notificationDate,
                description: notificationDescription,
                project_id: projectId
            }),
        });

        if (!response.ok) throw new Error("Error al guardar la notificación");

        const data = await response.json();

        
        bootstrap.Modal.getInstance(
                      document.getElementById("register_notification")
                    ).hide();
                    handleMessage("Notificación guardada correctamente");
                    CalendarContentGet(new Date());
    } catch (error) {
        console.error("Error al guardar la notificación:", error);
        handleMessage("Error al guardar la notificación.");
    }
};

    
    const handleMessage = (msg) => {
      setMessage(msg);
    
      const modalEl = document.getElementById("information_container");
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    
      setTimeout(() => {
        modal.hide();
      }, 3000);
    };

    return{
        CalendarContentGet,
        notificationPost,
        notifications,
        notification,
        projects,
        projectsRef,
        message,
        handleAddNotification,
        handleSaveNotification
    }
}