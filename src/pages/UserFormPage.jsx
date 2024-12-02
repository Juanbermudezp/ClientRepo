import React from 'react';
import Header from '../components/Admin/Header';
import UserForm from '../components/Admin/UserForm';
import '../styles/Form.css';

const UserFormPage = () => {
  return (
    <div>
      <Header />
      <div className="form-page">
        <UserForm onSubmit={(data) => console.log('Datos enviados:', data)} />
      </div>
    </div>
  );
};

export default UserFormPage;
