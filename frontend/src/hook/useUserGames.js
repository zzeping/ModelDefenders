import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 
import useAuthStore from '../store/authStore';
import useGamesStore from '../store/gamesStore';


const gamesApiClient = new APIClient('/game/user');

const useUserGames = () => {

  const user = useAuthStore((state) => state.user);
  const { setUserGames, setOwnGames } = useGamesStore();

  return useQuery('user_games', async () => {

    const userGames = await gamesApiClient.get(user.id);

    const gamesOwnedByUser = userGames.filter(game => game.ownerId === user.id);

    setUserGames(userGames);
    setOwnGames(gamesOwnedByUser);

    return userGames;
  });
};

export default useUserGames;
