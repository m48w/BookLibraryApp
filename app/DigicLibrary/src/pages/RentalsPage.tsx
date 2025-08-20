import React from 'react';
import MainLayout from '../components/templates/MainLayout';

const RentalsPage: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>貸出管理</h2>
        <p style={{ color: '#4b5563' }}>書籍の貸出・返却処理</p>
      </div>
    </MainLayout>
  );
};

export default RentalsPage;