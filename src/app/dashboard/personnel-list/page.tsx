
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllPersonnel, deletePersonnel } from '@/services/personnel.service';
import { toast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/activity-log';

type Personnel = {
  id: number;
  cardId: string;
  name: string;
  rank: string;
  specialization?: string;
  batch?: string;
  administration: string;
  status: string;
  statusDetail?: string;
  statusDate?: string;
};


export default function PersonnelListPage() {
  const [personnelData, setPersonnelData] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
        const data = await getAllPersonnel();
        setPersonnelData(data);
    } catch(error) {
        toast({ title: 'خطأ', description: 'فشل تحميل بيانات الضباط.', variant: 'destructive' });
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === 'personnelData' || customEvent.detail.key === 'all') {
            loadData();
        }
    };
    
    window.addEventListener('storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage-update', handleStorageChange);
    };
  }, [loadData]);

  const handleDelete = async (person: Personnel) => {
    try {
        await deletePersonnel(person.id);
        logActivity('delete_personnel', `تم حذف الضابط: ${person.name}`, `رقم البطاقة: ${person.cardId}`);
        toast({
          title: 'تم الحذف بنجاح',
          description: `تم حذف بيانات الضابط: ${person.name}`,
          variant: 'destructive'
        });
        // The storage event will trigger a reload of the data
    } catch (error) {
        toast({ title: 'خطأ', description: 'فشل حذف الضابط.', variant: 'destructive' });
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">قائمة الضباط</CardTitle>
          <CardDescription>عرض وإدارة بيانات جميع الضباط المسجلين في النظام.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <PersonnelTable data={personnelData} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
