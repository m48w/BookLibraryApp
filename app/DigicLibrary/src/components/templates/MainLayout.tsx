import React from 'react';
import styled from 'styled-components';
import Header from '../organisms/Header';
import { theme } from '../../styles/globalStyles';

const LayoutContainer = styled.div`
  background-color: #f9fafb;
  min-height: 100vh;
  min-width: 100vw;
`;

const MainContent = styled.main`
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  @media (min-width: ${() => theme.breakpoints.tablet}) {
    max-width: ${() => theme.maxWidth['7xl']};
  }
`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;