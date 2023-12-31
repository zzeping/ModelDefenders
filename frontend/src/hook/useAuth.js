import { useMutation } from 'react-query';
import APIClient from '../services/api-client';
import useAuthStore from '../store/authStore';
import useGamesStore from '../store/gamesStore';
import useBattleFieldStore from '../store/battleFieldStore';


const authClient = new APIClient('/user/login');
const authClient_r = new APIClient('/user/register');


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
            try {
                const response = await authClient_r.post({ username, password });
                return response; 
            } catch (error) {
                throw error;
            }
        },
        {
            onSuccess: (data) => {
                login(data.token, data.user);
                localStorage.setItem('token', data.token);
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
    const { removeGames } = useGamesStore();
    const { leaveField } = useBattleFieldStore();

    const handleLogout = () => {
        localStorage.removeItem('token');
        removeGames();
        leaveField();
        logout();
    };

    return {
        handleLogout,
    };
}