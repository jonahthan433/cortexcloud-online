import { create } from 'zustand';

interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  plan: string;
  settings?: any;
}

interface WorkspaceStore {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  setCurrentWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void;
  setLoading: (loading: boolean) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspace: null,
  workspaces: [],
  isLoading: false,
  
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  
  setWorkspaces: (workspaces) => set({ workspaces }),
  
  addWorkspace: (workspace) =>
    set((state) => ({ workspaces: [...state.workspaces, workspace] })),
  
  updateWorkspace: (id, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
      currentWorkspace:
        state.currentWorkspace?.id === id
          ? { ...state.currentWorkspace, ...updates }
          : state.currentWorkspace,
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
}));


