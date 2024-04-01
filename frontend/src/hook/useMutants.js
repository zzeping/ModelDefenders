import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 
import useBattleFieldStore from '../store/battleFieldStore';

const mutantsApiClient = new APIClient('/mutant/game');

const useGameMutants = () => {
  const gameId = useBattleFieldStore((state) => state.gameId);
  const fetchMutants = async () => {
    const mutants = await mutantsApiClient.get(gameId);
    return mutants;
  }
  const { data, refetch } = useQuery('mutants', fetchMutants);


  return { data, refetch };
};

export default useGameMutants;