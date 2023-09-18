import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from 'react-router-dom'
import router from './routes'

const queryClient = new QueryClient();


function App() {

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
