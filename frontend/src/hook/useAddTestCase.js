import { useMutation, useQueryClient } from 'react-query';
import APIClient from '../services/api-client';

const testCaseClient = new APIClient('/testCase');

const useAddTestCase = () => {
  const queryClient = useQueryClient();
  const addTestCaseMutation = useMutation(
    'testCases', 
    async (data) => {
      return await testCaseClient.post(data);
    },
    {
      onSuccess: () => {
          queryClient.invalidateQueries('testCases');
      },
  }
  );

  const handleAddTestCase = async (data) => {
    try {
      await addTestCaseMutation.mutateAsync(data);
    } catch (error) {
      console.error('Add test case failed:', error);
      throw error;
    }
  };

  return {
    handleAddTestCase,
    isAdding: addTestCaseMutation.isLoading,
    error: addTestCaseMutation.isError ? addTestCaseMutation.error : null,
  };
};

export default useAddTestCase;