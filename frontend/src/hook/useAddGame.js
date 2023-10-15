import { useMutation } from 'react-query';
import APIClient from '../services/api-client';

const gameClient = new APIClient('/game');

const useAddGame = () => {

  const addGameMutation = useMutation(
    'user_games', 
    async ({modelId, ownerId, defenderId, attackerId, notation}) => {
      return await gameClient.post({modelId, ownerId, defenderId, attackerId, notation});
    }
  );

  const handleAddGame = async ({modelId, ownerId, defenderId, attackerId, notation}) => {
    try {
      await addGameMutation.mutateAsync({modelId, ownerId, defenderId, attackerId, notation});
    } catch (error) {
      console.error('Add game failed:', error);
      throw error;
    }
  };

  return {
    handleAddGame,
    isAdding: addGameMutation.isLoading,
    error: addGameMutation.isError ? addGameMutation.error : null,
  };
};

export default useAddGame;
