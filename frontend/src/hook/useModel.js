import { useQuery } from 'react-query';
import APIClient from '../services/api-client'; 

const modelApiClient = new APIClient('/model');

const useModel = (id) => {
  return useQuery(['models', id], async () => {

    const model = await modelApiClient.get(id);

    return model;
  });
};

export default useModel;
