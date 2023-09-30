import AvailableGames from '../components/AvailableGames';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';



const HomePage = () => {
    const navigate = useNavigate();

    return (
        <>
            <AvailableGames />
            <Typography variant="h6" style={{ marginTop: '150px' }}>
                Create a new game:
            </Typography>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    color="primary"
                    variant="contained"
                    style={{ width: '100%' }}
                    onClick={() => navigate('/create')}
                >Create Game</Button>
            </Box>

        </>);
}


export default HomePage;