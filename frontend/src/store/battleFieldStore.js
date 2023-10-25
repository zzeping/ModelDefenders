import { create } from 'zustand';

const useBattleFieldStore = create((set) => ({
    gameId: '',
    role: '',
    modelId: '',
    setGame: (game) => {
        set({ game })
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