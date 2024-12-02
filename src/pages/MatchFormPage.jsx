import React from 'react';
import Header from '../components/Admin/Header';
import MatchForm from '../components/Admin/MatchForm';
import '../styles/Form.css'; 

const MatchFormPage = () => {
  const handleFormSubmit = (formData) => {
    console.log('Datos enviados:', formData);
  };

  return (
    <>
      <Header /> 
      <div className="form-page">
        <MatchForm onSubmit={handleFormSubmit} />
      </div>
    </>
  );
};

export default MatchFormPage;
