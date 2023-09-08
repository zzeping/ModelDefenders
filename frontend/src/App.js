import React from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import theme from './themes.js'; 
import { ThemeProvider } from '@mui/material/styles';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Header />
        <Body/>
      </div>
    </ThemeProvider>
  );
}

export default App;