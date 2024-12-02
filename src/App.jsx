import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserTable from './components/Admin/UserTable';
import UserForm from './components/Admin/UserForm';
import TeamTable from './components/Admin/TeamTable';
import TeamForm from './components/Admin/TeamForm';
import MatchTable from './components/Admin/MatchTable';
import MatchFormPage from './pages/MatchFormPage';
import CatalogPage from './pages/CatalogPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserTable />} />
        <Route path="/admin/users" element={<UserTable />} />
        <Route path="/admin/users/form" element={<UserForm />} />
        <Route path="/admin/teams" element={<TeamTable />} />
        <Route path="/admin/teams/form" element={<TeamForm />} />
        <Route path="/admin/matches" element={<MatchTable />} />
        <Route path="/admin/matches/form" element={<MatchFormPage />} />
        <Route path="/admin/catalog" element={<CatalogPage />} />
      </Routes>
    </Router>
  );
};

export default App;
