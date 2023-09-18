import {create} from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;