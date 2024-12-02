import React, { useState, useEffect } from 'react';
import Header from '../components/Admin/Header';
import '../styles/Catalog.css';

const CatalogPage = () => {

  const [categories, setCategories] = useState([]);
  const [sports, setSports] = useState([]);
  const [roles, setRoles] = useState([]);


  const fetchData = async (url, setFunction) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setFunction(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };


  const addData = async (url, list, setFunction, newItem) => {
    if (newItem.trim() && !list.includes(newItem)) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newItem }),
        });
        const data = await response.json();
        setFunction([...list, data.name]);
      } catch (error) {
        console.error('Error al añadir datos:', error);
      }
    }
  };


  const renderSection = (title, list, setFunction, apiEndpoint) => (
    <div className="catalog-section">
      <h3>{title}</h3>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>{title}</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <input
                  type="text"
                  value={item}
                  readOnly
                />
              </td>
              <td>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn-add"
        onClick={() =>
          addData(
            apiEndpoint,
            list,
            setFunction,
            prompt(`Añadir un nuevo ${title.toLowerCase()}:`)
          )
        }
      >
        Añadir
      </button>
    </div>
  );

  useEffect(() => {
    fetchData('http://localhost:5000/api/catalog/categories', setCategories);
    fetchData('http://localhost:5000/api/catalog/sports', setSports);
    fetchData('http://localhost:5000/api/catalog/roles', setRoles);

  }, []);

  return (
    <>
      <Header /> 
      <div className="catalog-page">
        <h2>Catálogo</h2>
        {renderSection('Categoría', categories, setCategories, 'http://localhost:5000/api/catalog/categories')}
        {renderSection('Deporte', sports, setSports, 'http://localhost:5000/api/catalog/sports')}
        {renderSection('Rol', roles, setRoles, 'http://localhost:5000/api/catalog/roles')}
      </div>
    </>
  );
};

export default CatalogPage;
