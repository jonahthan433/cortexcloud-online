import { create } from 'zustand';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  content?: string;
  processed_data?: any;
  created_at: string;
}

interface UploadProgress {
  [key: string]: number;
}

interface DocumentStore {
  documents: Document[];
  uploadProgress: UploadProgress;
  isLoading: boolean;
  
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: (fileId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  uploadProgress: {},
  isLoading: false,
  
  setDocuments: (documents) => set({ documents }),
  
  addDocument: (document) =>
    set((state) => ({ documents: [...state.documents, document] })),
  
  updateDocument: (id, updates) =>
    set((state) => ({
      documents: state.documents.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      ),
    })),
  
  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
  
  setUploadProgress: (fileId, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [fileId]: progress },
    })),
  
  clearUploadProgress: (fileId) =>
    set((state) => {
      const { [fileId]: _, ...rest } = state.uploadProgress;
      return { uploadProgress: rest };
    }),
  
  setLoading: (isLoading) => set({ isLoading }),
}));


