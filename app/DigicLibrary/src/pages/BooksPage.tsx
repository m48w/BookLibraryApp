import React from 'react';
import MainLayout from '../components/templates/MainLayout';

const BooksPage: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>蔵書管理</h2>
        <p style={{ color: '#4b5563' }}>書籍の登録・検索・管理</p>
      </div>
    </MainLayout>
  );
};

export default BooksPage;