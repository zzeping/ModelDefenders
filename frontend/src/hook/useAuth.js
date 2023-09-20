import { useMutation } from 'react-query';
import APIClient from '../services/api-client';
import useAuthStore from '../authStore';

const authClient = new APIClient('/login');
const authClient_r = new APIClient('/register');


export function useLogin() {
    const { login } = useAuthStore();

    const loginMutation = useMutation(
        async ({ username, password }) => {
            const response = await authClient.post({ username, password });
            return response;
        },
        {
            onSuccess: (data) => {
                login(data.token, data.user); 
                localStorage.setItem('token', data.token);
            },
        }
    );

    const handleLogin = async (username, password) => {
        try {
            await loginMutation.mutateAsync({ username, password });
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    return {
        handleLogin,
        isLoading: loginMutation.isLoading,
        error: loginMutation.isError ? loginMutation.error : null,
    };
}
export function useRegister() {
    const { login } = useAuthStore();

    const registerMutation = useMutation(
        async ({ username, password }) => {
            const response = await authClient_r.post({ username, password });
            return response;
        },
        {
            onSuccess: (data) => {
                login(data);
            },
        }
    );

    const handleRegister = async (username, password) => {
        try {
            await registerMutation.mutateAsync({ username, password });
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    return {
        handleRegister,
        isLoading: registerMutation.isLoading,
        error: registerMutation.isError ? registerMutation.error : null,
    };
}

export function useLogout() {
    const { logout } = useAuthStore();
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      logout();
      };
  
    return {
      handleLogout,
    };
  }