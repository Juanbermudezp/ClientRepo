import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Admin/Header';
import '../../styles/Form.css';

const UserForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.user || null; 
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    rol: '',
    equipo: '',
    deporte: '',
    ubicacion: '',
    correo: '',
    descripcion: '',
  });

  const [roles, setRoles] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setIsLoading(true);
        const rolesResponse = await fetch('http://localhost:5000/api/catalog/roles');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        const deportesResponse = await fetch('http://localhost:5000/api/catalog/sports');
        const deportesData = await deportesResponse.json();
        setDeportes(deportesData);
      } catch (error) {
        console.error('Error al cargar catálogos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData
        ? `http://localhost:5000/api/users/${initialData.id}` 
        : 'http://localhost:5000/api/users'; 

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombre,
          role: formData.rol,
          team: formData.equipo,
          sport: formData.deporte,
          location: formData.ubicacion,
          email: formData.correo,
          description: formData.descripcion,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        alert(
          initialData
            ? `Usuario ${user.name} actualizado con éxito.`
            : `Usuario ${user.name} creado con éxito.`
        );
        navigate('/admin/users'); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al guardar el usuario.');
    }
  };

  return (
    <>
      <Header />
      <div className="form-page">
        {isLoading ? (
          <p>Cargando catálogos...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Editar Usuario' : 'Registrar Usuario'}</h2>

            <label>Nombre del Usuario:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingrese el nombre del usuario"
              required
              disabled={!!initialData} 
            />

            <label>Rol:</label>
            <select name="rol" value={formData.rol} onChange={handleChange} required>
              <option value="">Seleccione un rol</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>

            <label>Equipo:</label>
            <input
              type="text"
              name="equipo"
              value={formData.equipo}
              onChange={handleChange}
              placeholder="Ingrese el nombre del equipo"
              required
            />

            <label>Deporte:</label>
            <select
              name="deporte"
              value={formData.deporte}
              onChange={handleChange}
              required
              disabled={!!initialData} 
            >
              <option value="">Seleccione un deporte</option>
              {deportes.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>

            <label>Ubicación:</label>
            <input
              type="text"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="Ingrese la ubicación"
              required
              disabled={!!initialData} 
            />

            <label>Correo:</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Ingrese el correo electrónico"
              required
              disabled={!!initialData} 
            />

            <label>Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Agregue una descripción"
              disabled={!!initialData} 
            ></textarea>

            <button type="submit" className="btn-submit">
              {initialData ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default UserForm;
