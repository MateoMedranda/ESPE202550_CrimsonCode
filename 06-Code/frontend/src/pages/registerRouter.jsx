import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE_URL = 'https://sima-es01.onrender.com';

function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    personal_id: '',
    born_date: '',
    email: '',
    phone_number: '',
    username: '',
  });
  const [populatedFields, setPopulatedFields] = useState(new Set());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();
      if (res.ok && data.email) {
        const newFormData = { ...formData };
        const newPopulated = new Set();

        if (data.given_name) {
          newFormData.name = data.given_name;
          newPopulated.add('name');
        }
        if (data.family_name) {
          newFormData.surname = data.family_name;
          newPopulated.add('surname');
        }
        if (data.email) {
          newFormData.email = data.email;
          newPopulated.add('email');
        }
        if (data.sub) {
          newFormData.username = `user_${data.sub.slice(0, 10)}`;
          newPopulated.add('username');
        }
        if (data.name && !newFormData.name && !newFormData.surname) {
          const [given, family] = data.name.split(' ');
          newFormData.name = given || '';
          newFormData.surname = family || '';
          newPopulated.add('name');
          newPopulated.add('surname');
        }
        if (!newFormData.username && newFormData.name && newFormData.surname) {
          newFormData.username = `${newFormData.name.toLowerCase()}.${newFormData.surname.toLowerCase()}`;
        }

        setFormData(newFormData);
        setPopulatedFields(newPopulated);
        setIsValid(true);
        setError('');
      } else {
        setError('⚠ Error en autenticación con Google');
        console.error('Google OAuth response:', data);
      }
    } catch (error) {
      setError('⚠ Error de conexión con Google');
      console.error('Google OAuth error:', error);
    }
  };

  useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  script.onload = () => {
    if (window.google && document.getElementById('googleSignInDiv')) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large' }
      );
    } else {
      console.error('Google script loaded but div not found.');
    }
  };
  document.body.appendChild(script);

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
          setFormData((prev) => ({ ...prev, email: data.email }));
          setPopulatedFields((prev) => new Set([...prev, 'email']));
          setIsValid(true);
        }
      } catch {
        setError('⚠ Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
          navigate('/login');
        }, 5000);
      } else {
        setError(data.error || 'Error registrando usuario');
      }
    } catch {
      setError('Error de conexión');
    }
  };

  if (loading) return <h3 className="text-center mt-5">Cargando...</h3>;
  if (error) return <h3 className="text-danger text-center mt-5">{error}</h3>;

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded-3" style={{ maxWidth: '500px', width: '100%', backgroundColor: 'white' }}>
        <h2 className="text-center mb-4">Formulario de Registro</h2>
        <div className="text-center mb-3">
          <div id="googleSignInDiv"></div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${populatedFields.has('name') ? 'bg-light' : ''}`}
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingrese su nombre"
              readOnly={populatedFields.has('name')}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="surname" className="form-label">Apellido</label>
            <input
              type="text"
              className={`form-control ${populatedFields.has('surname') ? 'bg-light' : ''}`}
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              placeholder="Ingrese su apellido"
              readOnly={populatedFields.has('surname')}
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
              className={`form-control ${populatedFields.has('email') ? 'bg-light' : ''}`}
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              readOnly={populatedFields.has('email')}
              required
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
              className={`form-control ${populatedFields.has('username') ? 'bg-light' : ''}`}
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Ingrese su nombre de usuario"
              readOnly={populatedFields.has('username')}
              required
            />
          </div>
          <div className="mb-3">
            <p className="text-muted">La contraseña inicial será su número de cédula</p>
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registro Exitoso</h5>
              </div>
              <div className="modal-body">
                <p className="text-success">✅ Usuario registrado correctamente. Redirigiendo al login en 5 segundos...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterPage;