import AvailableGames from '../components/AvailableGames';
import { Button, Typography, Box } from '@mui/material';


const HomePage = () => {
    console.log("go to home. ");

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
                >Create Game</Button>
            </Box>

        </>);
}


export default HomePage;