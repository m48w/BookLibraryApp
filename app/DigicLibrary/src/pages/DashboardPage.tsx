import React from 'react';
import styled from 'styled-components';
import MainLayout from '../components/templates/MainLayout';
import StatCard from '../components/molecules/StatCard';
import { FaUsers, FaBook, FaBookOpen, FaExclamationTriangle } from 'react-icons/fa';
import { theme } from '../styles/globalStyles';

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.875rem;
  font-weight: bold;
  color: ${() => theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${() => theme.colors.muted};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: ${() => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
  }
`;

const DashboardPage: React.FC = () => {
  // Dummy data for now
  const stats = [
    { id: 1, icon: <FaUsers />, title: '総社員数', value: 50, iconColor: '#3b82f6' },
    { id: 2, icon: <FaBook />, title: '総蔵書数', value: 120, iconColor: '#10b981' },
    { id: 3, icon: <FaBookOpen />, title: '貸出中', value: 15, iconColor: '#f59e0b' },
    { id: 4, icon: <FaExclamationTriangle />, title: '延滞', value: 3, iconColor: '#ef4444' },
  ];

  return (
    <MainLayout>
      <PageHeader>
        <Title>Dashboard</Title>
        <Subtitle>書籍貸出管理システムの概要</Subtitle>
      </PageHeader>
      <StatsGrid>
        {stats.map(stat => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            iconColor={stat.iconColor}
          />
        ))}
      </StatsGrid>
    </MainLayout>
  );
};

export default DashboardPage;