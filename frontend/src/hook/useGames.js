import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 
import useAuthStore from '../store/authStore';
import useGamesStore from '../store/gamesStore';

const gamesApiClient = new APIClient('/game/availables');

const useAvailableGames = () => {

  const user = useAuthStore((state) => state.user);
  const { setAvailableGames } = useGamesStore();

  return useQuery('games', async () => {

    const availableGames = await gamesApiClient.get(user.id);
    setAvailableGames(availableGames);

    return availableGames;
  });
};

export default useAvailableGames;
