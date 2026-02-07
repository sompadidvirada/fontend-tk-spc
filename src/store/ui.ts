import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "ENG" | "LA";

interface UIState {
  isSidebarOpen: boolean;
  language: string;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      language: "LA",
      setLanguage: (language) => {
        document.cookie = `lang=${language}; path=/`;
        set({ language });
      },
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      openSidebar: () => set({ isSidebarOpen: true }),
      closeSidebar: () => set({ isSidebarOpen: false }),
    }),
    {
      name: "ui-storage",
    }
  )
);
