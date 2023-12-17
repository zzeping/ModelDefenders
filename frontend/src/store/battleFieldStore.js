import { create } from 'zustand';

const useBattleFieldStore = create((set) => ({
    gameId: '',
    role: '',
    modelId: '',
    setGame: (gameId) => {
        set({ gameId })
    },
    setRole: (role) => {
        set({ role })
    },
    setModel: (modelId) => {
        set({ modelId })
    },
    leaveField: () => set({ gameId: '', role: '', modelId: '' }),
}));

export default useBattleFieldStore;