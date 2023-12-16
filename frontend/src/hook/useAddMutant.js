import { useMutation, useQueryClient } from 'react-query';
import APIClient from '../services/api-client';

const mutantClient = new APIClient('/mutant');

const useAddMutant = () => {
  const queryClient = useQueryClient();
  const addMutantMutation = useMutation(
    'mutants', 
    async (data) => {
      return await mutantClient.post(data);
    },
    {
      onSuccess: () => {
          queryClient.invalidateQueries('mutants');
      },
  }
  );

  const handleAddMutant = async (data) => {
    try {
      await addMutantMutation.mutateAsync(data);
    } catch (error) {
      console.error('Add mutant failed:', error);
      throw error;
    }
  };

  return {
    handleAddMutant,
    isAdding: addMutantMutation.isLoading,
    error: addMutantMutation.isError ? addMutantMutation.error : null,
  };
};

export default useAddMutant;