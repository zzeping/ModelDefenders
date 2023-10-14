import { useQuery } from 'react-query';
import APIClient from '../services/api-client';
import { useNavigate } from 'react-router-dom'; // Import useHistory


const userApiClient = new APIClient('/user');

const useUser = (id) => {
  const navigate = useNavigate();
  return useQuery(['users', id], async () => {
    const token = localStorage.getItem('token')
    try {
      const user = await userApiClient.get(id, token);
      return user;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login'); 
      }
      throw error;
    }
  });
};

export default useUser;
