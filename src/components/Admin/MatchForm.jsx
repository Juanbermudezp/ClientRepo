import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/Form.css';

const MatchForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state?.match || null;

  const [formData, setFormData] = useState(initialData || {
    nombrePartido: '',
    resultado: '',
    categoria: '',
    deporte: '',
    ubicacion: '',
    comentarios: '',
  });

  const [categorias, setCategorias] = useState([]);
  const [deportes, setDeportes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        setIsLoading(true);
        const categoriasResponse = await fetch('http://localhost:5000/api/catalog/categories');
        const categoriasData = await categoriasResponse.json();
        setCategorias(categoriasData);

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
        ? `http://localhost:5000/api/matches/${initialData.id}`
        : 'http://localhost:5000/api/matches';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.nombrePartido,
          result: formData.resultado,
          category: formData.categoria,
          sport: formData.deporte,
          location: formData.ubicacion,
          comments: formData.comentarios,
        }),
      });

      if (response.ok) {
        alert(`Partido ${initialData ? 'actualizado' : 'creado'} con éxito`);
        navigate('/admin/matches');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al guardar el partido.');
    }
  };

  return (
    <>
      <div className="form-page">
        {isLoading ? (
          <p>Cargando catálogos...</p>
        ) : (
          <form className="match-form" onSubmit={handleSubmit}>
            <h2>{initialData ? 'Editar Partido' : 'Registrar Partido'}</h2>

            <label>Nombre del Partido:</label>
            <input
              type="text"
              name="nombrePartido"
              value={formData.nombrePartido}
              onChange={handleChange}
              placeholder="Ingrese el nombre del partido"
              required
              disabled={!!initialData}
            />

            <label>Resultado:</label>
            <input
              type="text"
              name="resultado"
              value={formData.resultado}
              onChange={handleChange}
              placeholder="Ingrese el resultado"
              required
            />

            <label>Categoría:</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.name}>
                  {categoria.name}
                </option>
              ))}
            </select>

            <label>Deporte:</label>
            <select
              name="deporte"
              value={formData.deporte}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un deporte</option>
              {deportes.map((deporte) => (
                <option key={deporte.id} value={deporte.name}>
                  {deporte.name}
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
            />

            <label>Comentarios:</label>
            <textarea
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
              placeholder="Ingrese comentarios"
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

export default MatchForm;
