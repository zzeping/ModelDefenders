import { useMutation, useQueryClient } from 'react-query';
import APIClient from '../services/api-client';

const gameClient = new APIClient('/game/join');

const useJoinGame = () => {
  const queryClient = useQueryClient();
  const joinGameMutation = useMutation(
    'games', 
    async (data) => {
      return await gameClient.post(data);
    },
    {
      onSuccess: () => {
          queryClient.invalidateQueries('games');
          queryClient.invalidateQueries('user_games');
      },
  }
  );

  const handleJoinGame = async (data) => {
    try {
      await joinGameMutation.mutateAsync(data);
    } catch (error) {
      console.error('Join Game failed:', error);
      throw error;
    }
  };

  return {
    handleJoinGame,
    isJoining: joinGameMutation.isLoading,
    error: joinGameMutation.isError ? joinGameMutation.error : null,
  };
};

export default useJoinGame;