import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://sima-es01.onrender.com' 
  : 'http://localhost:3001';

function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    personal_id: '',
    born_date: '',
    email: '',
    phone_number: '',
    username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    window.handleCredentialResponse = (response) => {
      fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential })
      })
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            setFormData(prev => ({
              ...prev,
              email: data.email,
              name: data.name || prev.name,
              surname: data.surname || prev.surname
            }));
            setIsValid(true);
            setError('');
          } else {
            setError('⚠ Error en autenticación con Google');
          }
        })
        .catch(() => setError('⚠ Error de conexión con Google'));
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('❌ Enlace inválido');
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/invite/validate-token?token=${token}`);
        const data = await res.json();
        if (!data.valid) {
          setError('❌ Enlace expirado o inválido');
        } else {
          setFormData(prev => ({ ...prev, email: data.email }));
          setIsValid(true);
        }
      } catch (err) {
        setError('⚠ Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Usuario registrado correctamente');
      } else {
        alert(data.error || 'Error registrando usuario');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  if (loading) return <h3 className="text-center mt-5">Cargando...</h3>;
  if (error) return <h3 className="text-danger text-center mt-5">{error}</h3>;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded-3" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'white' }}>
        <h2 className="text-center mb-4">Formulario de Registro</h2>
        <div className="text-center mb-3">
          <div id="g_id_onload"
            data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
            data-callback="handleCredentialResponse"
            data-auto_prompt="false">
          </div>
          <div className="g_id_signin" data-type="standard" data-size="large" data-theme="outline" data-text="sign_in_with" data-shape="rectangular"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingrese su nombre"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="surname" className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              placeholder="Ingrese su apellido"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="personal_id" className="form-label">Cédula</label>
            <input
              type="text"
              className="form-control"
              id="personal_id"
              name="personal_id"
              value={formData.personal_id}
              onChange={handleInputChange}
              placeholder="Ingrese su cédula"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="born_date" className="form-label">Fecha de Nacimiento</label>
            <input
              type="date"
              className="form-control"
              id="born_date"
              name="born_date"
              value={formData.born_date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Teléfono</label>
            <input
              type="tel"
              className="form-control"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              placeholder="Ingrese su número de teléfono"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Nombre de Usuario</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ingrese su nombre de usuario"
              required
            />
          </div>
          <div className="mb-3">
            <h3>La contraseña inicial sera su numero de cedula</h3>
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;