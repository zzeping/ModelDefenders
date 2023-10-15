import { useMutation, useQueryClient } from 'react-query';
import APIClient from '../services/api-client';

const modelClient = new APIClient('/model');

const useDeleteModel = () => {
    const queryClient = useQueryClient();
    const deleteModelMutation = useMutation(
        'models',
        async (id) => {
            return await modelClient.delete(id);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('models');
            },
        }
    );

    const handleDeleteModel = async (id) => {
        try {
            await deleteModelMutation.mutateAsync(id);
        } catch (error) {
            console.error('Delete model failed:', error);
            throw error;
        }
    };

    return {
        handleDeleteModel,
        isDeleting: deleteModelMutation.isLoading,
        error: deleteModelMutation.isError ? deleteModelMutation.error : null,
    };
};

export default useDeleteModel;