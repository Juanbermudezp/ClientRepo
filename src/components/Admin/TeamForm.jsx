import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import '../../styles/Form.css';

const TeamForm = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('id');
  const navigate = useNavigate();
  const initialData = location.state?.team || null;

  const [formData, setFormData] = useState(initialData || {
    nombreEquipo: '',
    director: '',
    categoria: '',
    deporte: '',
    numeroJugadores: '',
    nombresJugadores: [],
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
        console.error('Error al obtener catálogos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  useEffect(() => {
    const fetchTeamById = async () => {
      if (!initialData && teamId) {
        try {
          const response = await fetch(`http://localhost:5000/api/teams/${teamId}`);
          const team = await response.json();
          setFormData({
            nombreEquipo: team.name,
            director: team.director,
            categoria: team.category,
            deporte: team.sport,
            numeroJugadores: team.players.length.toString(),
            nombresJugadores: team.players,
          });
        } catch (error) {
          console.error('Error al cargar el equipo:', error);
        }
      }
    };
    fetchTeamById();
  }, [initialData, teamId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'numeroJugadores') {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num > 0) {
        const jugadores = Array(num)
          .fill('')
          .map((_, index) => formData.nombresJugadores[index] || '');
        setFormData({ ...formData, [name]: value, nombresJugadores: jugadores });
      } else {
        setFormData({ ...formData, [name]: value, nombresJugadores: [] });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePlayerChange = (index, value) => {
    const updatedPlayers = [...formData.nombresJugadores];
    updatedPlayers[index] = value;
    setFormData({ ...formData, nombresJugadores: updatedPlayers });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        initialData || teamId
          ? `http://localhost:5000/api/teams/${teamId || initialData.id}`
          : 'http://localhost:5000/api/teams',
        {
          method: initialData || teamId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.nombreEquipo,
            director: formData.director,
            category: formData.categoria,
            sport: formData.deporte,
            players: formData.nombresJugadores,
          }),
        }
      );
      if (response.ok) {
        alert(`Equipo ${initialData || teamId ? 'actualizado' : 'creado'} con éxito`);
        navigate('/admin/teams'); 
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
      alert('Ocurrió un error al guardar el equipo.');
    }
  };

  return (
    <>
      <Header />
      <div className="form-page">
        {isLoading ? (
          <p>Cargando catálogos...</p>
        ) : (
          <form className="team-form" onSubmit={handleSubmit}>
            <h2>{initialData || teamId ? 'Editar Equipo' : 'Registrar Equipo'}</h2>

            <label>Nombre del Equipo:</label>
            <input
              type="text"
              name="nombreEquipo"
              value={formData.nombreEquipo}
              onChange={handleChange}
              placeholder="Ingrese el nombre del equipo"
              required
              disabled={!!(initialData || teamId)}
            />

            <label>Nombre del Director:</label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              placeholder="Ingrese el nombre del director"
              required
              disabled={!!(initialData || teamId)} 
            />

            <label>Categoría:</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              disabled={!!(initialData || teamId)}
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
              disabled={!!(initialData || teamId)}
            >
              <option value="">Seleccione un deporte</option>
              {deportes.map((deporte) => (
                <option key={deporte.id} value={deporte.name}>
                  {deporte.name}
                </option>
              ))}
            </select>

            <label>Número de Jugadores:</label>
            <input
              type="number"
              name="numeroJugadores"
              value={formData.numeroJugadores}
              onChange={handleChange}
              placeholder="Ingrese el número de jugadores"
              required
              min="1"
            />

            {formData.nombresJugadores.length > 0 && (
              <div className="players-list">
                <h3>Nombres de Jugadores:</h3>
                {formData.nombresJugadores.map((player, index) => (
                  <div key={index}>
                    <label>Jugador {index + 1}:</label>
                    <input
                      type="text"
                      value={player}
                      onChange={(e) => handlePlayerChange(index, e.target.value)}
                      placeholder={`Nombre del jugador ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="btn-submit">
              {initialData || teamId ? 'Actualizar' : 'Crear'}
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default TeamForm;
