import { useMutation } from 'react-query';
import APIClient from '../services/api-client';

const gameClient = new APIClient('/game');

const useDeleteGame = () => {

    const deleteGameMutation = useMutation(
        'games',
        async (id) => {
            return await gameClient.delete(id);
        }
    );

    const handleDeleteGame = async (id) => {
        try {
            await deleteGameMutation.mutateAsync(id);
        } catch (error) {
            console.error('Delete model failed:', error);
            throw error;
        }
    };

    return {
        handleDeleteGame,
        error: deleteGameMutation.isError ? deleteGameMutation.error : null,
    };
};

export default useDeleteGame;