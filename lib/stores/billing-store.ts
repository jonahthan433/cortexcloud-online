import { create } from 'zustand';

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_end?: string;
}

interface Usage {
  workflow_runs: number;
  documents_processed: number;
  api_calls: number;
}

interface BillingStore {
  subscription: Subscription | null;
  usage: Usage | null;
  limits: {
    workflow_runs: number;
    documents: number;
    users: number;
    api_calls: number;
  };
  isLoading: boolean;
  
  setSubscription: (subscription: Subscription | null) => void;
  setUsage: (usage: Usage) => void;
  setLimits: (limits: BillingStore['limits']) => void;
  setLoading: (loading: boolean) => void;
}

export const useBillingStore = create<BillingStore>((set) => ({
  subscription: null,
  usage: null,
  limits: {
    workflow_runs: 100,
    documents: 10,
    users: 1,
    api_calls: 1000,
  },
  isLoading: false,
  
  setSubscription: (subscription) => set({ subscription }),
  setUsage: (usage) => set({ usage }),
  setLimits: (limits) => set({ limits }),
  setLoading: (isLoading) => set({ isLoading }),
}));


