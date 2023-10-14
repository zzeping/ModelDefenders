import { useMutation } from 'react-query';
import APIClient from '../services/api-client';

const modelClient = new APIClient('/model');

const useAddModel = () => {

  const addModelMutation = useMutation(
    'models', 
    async (data) => {
      return await modelClient.post(data);
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