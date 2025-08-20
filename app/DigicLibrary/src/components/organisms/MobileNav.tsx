import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome, FaUsers, FaBook, FaExchangeAlt, FaHistory } from 'react-icons/fa';
import { theme } from '../../styles/globalStyles';

const MobileNavWrapper = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  position: absolute;
  top: 4rem; // height of the header
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  @media (min-width: ${() => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const NavLinks = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StyledNavLink = styled(NavLink)`
  color: ${() => theme.colors.text};
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &.active {
    color: ${() => theme.colors.primary};
    background-color: #eff6ff;
  }
`;

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  return (
    <MobileNavWrapper isOpen={isOpen}>
      <NavLinks>
        <StyledNavLink to="/" end onClick={onClose}><FaHome /><span>Dashboard</span></StyledNavLink>
        <StyledNavLink to="/employees" onClick={onClose}><FaUsers /><span>社員管理</span></StyledNavLink>
        <StyledNavLink to="/books" onClick={onClose}><FaBook /><span>蔵書管理</span></StyledNavLink>
        <StyledNavLink to="/rentals" onClick={onClose}><FaExchangeAlt /><span>貸出管理</span></StyledNavLink>
        <StyledNavLink to="/history" onClick={onClose}><FaHistory /><span>履歴</span></StyledNavLink>
      </NavLinks>
    </MobileNavWrapper>
  );
};

export default MobileNav;