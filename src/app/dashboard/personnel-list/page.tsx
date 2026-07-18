'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';
import { Skeleton } from '@/components/ui/skeleton';
import { deletePersonnel } from '@/services/personnel.service';
import type { Personnel } from '@/services/personnel.service';
import { toast } from '@/hooks/use-toast';
import { logActivity } from '@/lib/activity-log';
import { usePersonnel } from '@/contexts/PersonnelContext';


export default function PersonnelListPage() {
  const { personnel, loading, refetch } = usePersonnel();

  const handleDelete = async (person: Personnel) => {
    try {
        await deletePersonnel(person.id);
        await logActivity('delete_personnel', `تم حذف الضابط: ${person.name}`, `رقم البطاقة: ${person.cardId}`);
        toast({
          title: 'تم الحذف بنجاح',
          description: `تم حذف بيانات الضابط: ${person.name}`,
          variant: 'destructive'
        });
        refetch(); // Refresh the shared personnel data
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
            <PersonnelTable data={personnel} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
