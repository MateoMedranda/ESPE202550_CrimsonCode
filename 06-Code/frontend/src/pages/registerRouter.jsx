import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_BASE_URL = 'https://espe202550-crimsoncode.onrender.com/api/invite'; 

function RegisterPage() {
  const [searchParams] = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('❌ Enlace inválido');
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/register/validate-token?token=${token}`);
        const data = await res.json();
        if (!data.valid) {
          setError('❌ Enlace expirado o inválido');
        } else {
          setEmail(data.email);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email }),
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

  if (loading) return <h3>Cargando...</h3>;
  if (error) return <h3>{error}</h3>;

  return (
    <div>
      <h2>Formulario de Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="email"
          placeholder="Correo"
          value={email}
          readOnly
        />
        <br /><br />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default RegisterPage;