import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header'; 
import '../../styles/Table.css';

const MatchTable = () => {
  const [matches, setMatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const matchesResponse = await fetch('http://localhost:5000/api/matches');
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);

        const categoriesResponse = await fetch('http://localhost:5000/api/catalog/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const sportsResponse = await fetch('http://localhost:5000/api/catalog/sports');
        const sportsData = await sportsResponse.json();
        setSports(sportsData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const filteredMatches = matches.filter((match) => {
    const matchesSearch = match.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? match.category === filterCategory : true;
    const matchesSport = filterSport ? match.sport === filterSport : true;

    return matchesSearch && matchesCategory && matchesSport;
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este partido?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/matches/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setMatches(matches.filter((match) => match.id !== id));
          alert('Partido eliminado con éxito');
        } else {
          throw new Error('Error al eliminar el partido');
        }
      } catch (error) {
        console.error('Error al eliminar partido:', error);
        alert('No se pudo eliminar el partido. Intenta nuevamente.');
      }
    }
  };

  const handleEdit = (match) => {
    navigate('/admin/matches/form', { state: { match } });
  };

  return (
    <>
      <Header />
      <div className="table-container">
        <div className="action-container">
          <div className="search-and-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Buscar partido..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Filtrar por categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filterSport}
              onChange={(e) => setFilterSport(e.target.value)}
            >
              <option value="">Filtrar por deporte</option>
              {sports.map((sport) => (
                <option key={sport.id} value={sport.name}>
                  {sport.name}
                </option>
              ))}
            </select>
          </div>
          <Link to="/admin/matches/form">
            <button className="btn-create">Crear Partido</button>
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Partido</th>
              <th>Resultado</th>
              <th>Categoría</th>
              <th>Deporte</th>
              <th>Ubicación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <tr key={match.id}>
                  <td>{match.name}</td>
                  <td>{match.result || 'N/A'}</td>
                  <td>{match.category}</td>
                  <td>{match.sport}</td>
                  <td>{match.location || 'N/A'}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(match)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(match.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No se encontraron partidos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MatchTable;
