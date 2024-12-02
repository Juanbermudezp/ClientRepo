import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const Header = () => {
  return (
    <nav className="header">
      <div className="header-logo">
        <img src="/logo.png" alt="SportMatch Logo" />
        <span>SPORTMATCH</span>
      </div>
      <div className="header-links">
        <Link to="/admin/users">Usuarios</Link>
        <Link to="/admin/teams">Equipos</Link>
        <Link to="/admin/matches">Partidos</Link>
        <Link to="/admin/catalog">Catálogo</Link>
      </div>
      <div className="header-profile">
        <span>ADMINISTRADOR</span>
        <button className="logout-button">Cerrar sesión</button>
      </div>
    </nav>
  );
};

export default Header;
