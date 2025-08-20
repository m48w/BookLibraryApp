import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    // primary: '#673d89ff',
    primary: '#9491E2',
    secondary: '#6b7280',
    background: '#f9fafb',
    text: '#1f2937',
    muted: '#6b7280',
    white: '#ffffff',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
  },
  maxWidth: {
    '7xl': '80rem',
  }
};

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${() => theme.colors.background};
    color: ${() => theme.colors.text};
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;