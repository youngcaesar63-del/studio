'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getAllPersonnel } from '@/services/personnel.service';
import type { Personnel } from '@/services/personnel.service';
import { toast } from '@/hooks/use-toast';

type PersonnelContextType = {
  personnel: Personnel[];
  loading: boolean;
  refetch: () => void;
};

const PersonnelContext = createContext<PersonnelContextType | undefined>(undefined);

export function PersonnelProvider({ children }: { children: ReactNode }) {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPersonnel();
      setPersonnel(data);
    } catch (error) {
      toast({ title: 'خطأ فادح', description: 'فشل تحميل البيانات الأساسية للتطبيق.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Listen for custom storage events to refetch data globally
  useEffect(() => {
    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === 'personnelData' || customEvent.detail.key === 'all') {
            fetchData();
        }
    };
    
    window.addEventListener('storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage-update', handleStorageChange);
    };
  }, [fetchData]);

  return (
    <PersonnelContext.Provider value={{ personnel, loading, refetch: fetchData }}>
      {children}
    </PersonnelContext.Provider>
  );
}

export function usePersonnel() {
  const context = useContext(PersonnelContext);
  if (context === undefined) {
    throw new Error('usePersonnel must be used within a PersonnelProvider');
  }
  return context;
}
