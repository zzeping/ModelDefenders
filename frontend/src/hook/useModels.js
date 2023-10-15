import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 
import useAuthStore from '../store/authStore';

const modelsApiClient = new APIClient('/model/user');

const useUserModels = () => {
  const user = useAuthStore((state) => state.user);
  return useQuery('models', async () => {

    const models = await modelsApiClient.get(user.id);

    return models;
  });
};

export default useUserModels;