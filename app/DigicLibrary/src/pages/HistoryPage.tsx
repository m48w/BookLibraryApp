import React from 'react';
import MainLayout from '../components/templates/MainLayout';

const HistoryPage: React.FC = () => {
  return (
    <MainLayout>
      <div>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>貸出履歴</h2>
        <p style={{ color: '#4b5563' }}>過去の貸出・返却履歴</p>
      </div>
    </MainLayout>
  );
};

export default HistoryPage;