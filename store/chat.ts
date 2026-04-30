import { create } from "zustand";

type ChatStore = {
  chatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
};

export const useChatStore = create<ChatStore>()((set) => ({
  chatOpen: false,
  openChat: () => set({ chatOpen: true }),
  closeChat: () => set({ chatOpen: false }),
}));
