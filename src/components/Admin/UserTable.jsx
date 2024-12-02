import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import '../../styles/Table.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sports, setSports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch('http://localhost:5000/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const rolesResponse = await fetch('http://localhost:5000/api/catalog/roles');
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        const sportsResponse = await fetch('http://localhost:5000/api/catalog/sports');
        const sportsData = await sportsResponse.json();
        setSports(sportsData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.team?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = filterRole ? user.role === filterRole : true;
    const matchesSport = filterSport ? user.sport === filterSport : true;

    return matchesSearch && matchesRole && matchesSport;
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este usuario?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          setUsers(users.filter((user) => user.id !== id));
          alert('Usuario eliminado con éxito.');
        } else {
          throw new Error('No se pudo eliminar el usuario');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('Ocurrió un error al eliminar el usuario.');
      }
    }
  };

  const handleEdit = (user) => {
    navigate('/admin/users/form', { state: { user } });
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
                placeholder="Buscar Usuario..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Filtrar por ROL</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name}
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
          <Link to="/admin/users/form">
            <button className="btn-create">Crear Usuario</button>
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Equipo</th>
              <th>Deporte</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td>{user.team || 'N/A'}</td>
                  <td>{user.sport || 'N/A'}</td>
                  <td>
                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No se encontraron usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserTable;
