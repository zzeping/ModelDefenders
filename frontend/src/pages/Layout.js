import NavBar from '../components/NavBar';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';


const Layout = () => {
  return (
    <>
      <NavBar />
      <Box padding={5}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;