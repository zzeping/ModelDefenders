import { useMutation, useQueryClient } from 'react-query';
import APIClient from '../services/api-client';

const modelClient = new APIClient('/model');

const useAddModel = () => {
  const queryClient = useQueryClient();
  const addModelMutation = useMutation(
    'models', 
    async (data) => {
      return await modelClient.post(data);
    },
    {
      onSuccess: () => {
          queryClient.invalidateQueries('models');
      },
  }
  );

  const handleAddModel = async (data) => {
    try {
      await addModelMutation.mutateAsync(data);
    } catch (error) {
      console.error('Add model failed:', error);
      throw error;
    }
  };

  return {
    handleAddModel,
    isAdding: addModelMutation.isLoading,
    error: addModelMutation.isError ? addModelMutation.error : null,
  };
};

export default useAddModel;