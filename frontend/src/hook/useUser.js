import { useQuery } from 'react-query';
import APIClient from '../services/api-client';

const userApiClient = new APIClient('/user');

const useUser = (id) => {
  return useQuery(['user', id], async () => {
    const token = localStorage.getItem('token')
    const user = await userApiClient.get(id, token);
    return user;
  });
};

export default useUser;
