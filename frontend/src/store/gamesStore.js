import { create } from 'zustand';

const useGamesStore = create((set) => ({
    availableGames: null,
    userGames: null,
    ownGames: null,
    setAvailableGames: (availableGames) => {
        set({ availableGames})
    },
    setUserGames: (userGames) => {
        set({ userGames})
    },
    setOwnGames: (ownGames) => {
        set({ ownGames})
    },
    removeGames: () => set({ availableGames: null, userGames: null, ownGames: null }),
}));

export default useGamesStore;