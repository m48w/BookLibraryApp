import React from 'react';
import AppRouter from './routes';
import GlobalStyle, { theme } from './styles/globalStyles';
import { ThemeProvider } from 'styled-components';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppRouter />
    </ThemeProvider>
  );
};

export default App;