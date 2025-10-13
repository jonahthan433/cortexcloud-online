import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Modal {
  id: string;
  isOpen: boolean;
  data?: any;
}

interface UIStore {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
  modals: Record<string, Modal>;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openModal: (id: string, data?: any) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarCollapsed: false,
      modals: {},
      
      setTheme: (theme) => set({ theme }),
      
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      
      openModal: (id, data) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: { id, isOpen: true, data },
          },
        })),
      
      closeModal: (id) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: { ...state.modals[id], isOpen: false },
          },
        })),
      
      toggleModal: (id) =>
        set((state) => ({
          modals: {
            ...state.modals,
            [id]: {
              ...state.modals[id],
              id,
              isOpen: !state.modals[id]?.isOpen,
            },
          },
        })),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);


