import React from 'react';
import MainLayout from '../components/templates/MainLayout';

const EmployeesPage: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>社員管理</h2>
        <p style={{ color: '#4b5563' }}>社員の登録・編集・削除</p>
      </div>
    </MainLayout>
  );
};

export default EmployeesPage;