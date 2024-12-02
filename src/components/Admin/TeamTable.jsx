import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Header from './Header';
import '../../styles/Table.css';

const TeamTable = () => {
  const [teams, setTeams] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsResponse = await fetch('http://localhost:5000/api/teams');
        const teamsData = await teamsResponse.json();
        setTeams(teamsData);

        const categoriesResponse = await fetch('http://localhost:5000/api/catalog/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const sportsResponse = await fetch('http://localhost:5000/api/catalog/sports');
        const sportsData = await sportsResponse.json();
        setSports(sportsData);
      } catch (error) {
        console.error('Error al cargar datos:', error.message);
      }
    };

    fetchData();
  }, []);


  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? team.category === filterCategory : true;
    const matchesSport = filterSport ? team.sport === filterSport : true;

    return matchesSearch && matchesCategory && matchesSport;
  });


  const deleteTeam = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este equipo?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/teams/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar equipo');
      setTeams(teams.filter((team) => team.id !== id));
      alert('Equipo eliminado con éxito');
    } catch (error) {
      console.error('Error al eliminar equipo:', error);
      alert('Ocurrió un error al eliminar el equipo');
    }
  };


  const handleEdit = (team) => {
    console.log('Redirigiendo con el equipo:', team); 
    navigate(`/admin/teams/form?id=${team.id}`); 
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
                placeholder="Buscar equipo..."
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
          <Link to="/admin/teams/form">
            <button className="btn-create">Crear Equipo</button>
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Equipo</th>
              <th>Director</th>
              <th>Categoría</th>
              <th>Deporte</th>
              <th>Ubicación</th>
              <th>Jugadores</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <tr key={team.id}>
                  <td>{team.name}</td>
                  <td>{team.director}</td>
                  <td>{team.category}</td>
                  <td>{team.sport}</td>
                  <td>{team.location}</td>
                  <td>
                    {team.players && team.players.length > 0
                      ? team.players.join(', ')
                      : 'Sin jugadores'}
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(team)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => deleteTeam(team.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No se encontraron equipos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TeamTable;
