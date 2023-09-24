import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 

const gamesApiClient = new APIClient('/game/availables');

const useAvailableGames = () => {
  return useQuery('availableGames', async () => {

    const availableGames = await gamesApiClient.getAll();

    return availableGames;
  });
};

export default useAvailableGames;
