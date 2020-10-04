import { createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import Alerts from './pages/Alerts';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2F80ED"
    }
  }
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Alerts />
      <CssBaseline />
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;
