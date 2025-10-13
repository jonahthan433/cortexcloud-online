import { create } from 'zustand';

interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  steps: any[];
  triggers?: any;
  is_active: boolean;
}

interface WorkflowStore {
  workflows: Workflow[];
  activeWorkflow: Workflow | null;
  isLoading: boolean;
  
  setWorkflows: (workflows: Workflow[]) => void;
  setActiveWorkflow: (workflow: Workflow | null) => void;
  addWorkflow: (workflow: Workflow) => void;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useWorkflowStore = create<WorkflowStore>((set) => ({
  workflows: [],
  activeWorkflow: null,
  isLoading: false,
  
  setWorkflows: (workflows) => set({ workflows }),
  
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
  
  addWorkflow: (workflow) =>
    set((state) => ({ workflows: [...state.workflows, workflow] })),
  
  updateWorkflow: (id, updates) =>
    set((state) => ({
      workflows: state.workflows.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
      activeWorkflow:
        state.activeWorkflow?.id === id
          ? { ...state.activeWorkflow, ...updates }
          : state.activeWorkflow,
    })),
  
  deleteWorkflow: (id) =>
    set((state) => ({
      workflows: state.workflows.filter((w) => w.id !== id),
      activeWorkflow: state.activeWorkflow?.id === id ? null : state.activeWorkflow,
    })),
  
  setLoading: (isLoading) => set({ isLoading }),
}));


