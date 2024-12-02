import React from 'react';
import TeamForm from '../components/Admin/TeamForm';
import Header from '../components/Admin/Header';
import '../styles/Form.css';

const TeamFormPage = () => {
  const handleFormSubmit = (formData) => {
    console.log('Datos enviados:', formData);
  };

  return (
    <>
    <Header />
      <div className="form-page">
        <TeamForm onSubmit={handleFormSubmit} />
      </div>
    </>
  );
};

export default TeamFormPage;
