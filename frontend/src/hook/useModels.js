import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 

const modelsApiClient = new APIClient('/model');

const useModels = () => {
  return useQuery('Models', async () => {

    const models = await modelsApiClient.getAll();

    return models;
  });
};

export default useModels;