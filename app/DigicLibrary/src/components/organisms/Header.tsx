import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import MobileNav from './MobileNav';
import { FaBars, FaTimes, FaHome, FaUsers, FaBook, FaExchangeAlt, FaHistory, FaBookReader } from 'react-icons/fa';
import { theme } from '../../styles/globalStyles';

const HeaderWrapper = styled.header`
    background: linear-gradient(to right, ${() => theme.colors.primary}, #60a5fa);
  color: ${() => theme.colors.white};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;
`;

const NavContainer = styled.div`
  max-width: 7xl;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 4rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Logo = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: inherit;
`;

const NavLinks = styled.div`
  display: none;

  @media (min-width: ${() => theme.breakpoints.mobile}) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const StyledNavLink = styled(NavLink)`
  color: #dbeafe; // Lighter text color for non-active links
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;

  &.active {
    color: ${() => theme.colors.white};
    background-color: rgba(255, 255, 255, 0.15);
  }

  &:hover {
    color: ${() => theme.colors.white};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: ${() => theme.colors.white};
  cursor: pointer;

  @media (min-width: ${() => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!isMobileNavOpen);
  };

  const closeMobileNav = () => {
    setMobileNavOpen(false);
  }

  return (
    <HeaderWrapper>
      <NavContainer>
        <Nav>
          <LogoContainer>
            <FaBookReader size="1.5em" />
            <Logo>書籍貸出管理システム</Logo>
          </LogoContainer>
          <NavLinks>
            <StyledNavLink to="/" end><FaHome /><span>Dashboard</span></StyledNavLink>
            <StyledNavLink to="/employees"><FaUsers /><span>社員管理</span></StyledNavLink>
            <StyledNavLink to="/books"><FaBook /><span>蔵書管理</span></StyledNavLink>
            <StyledNavLink to="/rentals"><FaExchangeAlt /><span>貸出管理</span></StyledNavLink>
            <StyledNavLink to="/history"><FaHistory /><span>履歴</span></StyledNavLink>
          </NavLinks>
          <HamburgerButton onClick={toggleMobileNav}>
            {isMobileNavOpen ? <FaTimes /> : <FaBars />}
          </HamburgerButton>
        </Nav>
      </NavContainer>
      <MobileNav isOpen={isMobileNavOpen} onClose={closeMobileNav} />
    </HeaderWrapper>
  );
};

export default Header;