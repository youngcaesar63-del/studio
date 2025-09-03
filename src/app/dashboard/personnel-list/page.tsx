
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';

const initialPersonnelData = [
    { id: 1, cardId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', specialization: 'لا يوجد', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), bloodType: 'A+', maritalStatus: 'أعزب' },
    { id: 2, cardId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', specialization: 'طيار', administration: 'الإدارة العامة للأمن العسكري', status: 'إجازة', appointmentDate: new Date().toISOString(), bloodType: 'O+', maritalStatus: 'متزوج' },
    { id: 3, cardId: '30006150201236', name: 'علي حسن محمد', rank: 'ملازم أول', specialization: 'مهندس', administration: 'الإدارة العامة للاستخبارات', status: 'دورة تدريبية', appointmentDate: new Date().toISOString(), bloodType: 'B+', maritalStatus: 'أعزب' },
    { id: 4, cardId: '30107150201237', name: 'محمود سعيد عبدالله', rank: 'عقيد', specialization: 'ركن', administration: 'الإدارة العامة للمعلومات الاستراتيجية', status: 'عمليات', appointmentDate: new Date().toISOString(), bloodType: 'AB+', maritalStatus: 'متزوج' },
    { id: 5, cardId: '30208150201238', name: 'يوسف إبراهيم أحمد', rank: 'لواء', specialization: 'لا يوجد', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), bloodType: 'A-', maritalStatus: 'متزوج' },
    { id: 6, cardId: '30309150201239', name: 'سالم فهد', rank: 'فريق', specialization: 'لا يوجد', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), bloodType: 'O-', maritalStatus: 'متزوج' },
    { id: 7, cardId: '30410150201240', name: 'عبدالله تركي', rank: 'فريق أول', specialization: 'لا يوجد', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), bloodType: 'B-', maritalStatus: 'متزوج' },
];

const rankOrder: { [key: string]: number } = {
  'فريق أول': 1,
  'فريق': 2,
  'لواء': 3,
  'عميد': 4,
  'عقيد': 5,
  'مقدم': 6,
  'رائد': 7,
  'نقيب': 8,
  'ملازم أول': 9,
  'ملازم': 10,
};

export default function PersonnelListPage() {
  const [personnelData, setPersonnelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    let data = getLocalStorage('personnelData', null);
    if (data === null) {
      data = initialPersonnelData;
      updateLocalStorage('personnelData', initialPersonnelData);
    }
    
    const sortedData = data.sort((a: any, b: any) => {
      const rankA = rankOrder[a.rank] || 99;
      const rankB = rankOrder[b.rank] || 99;
      return rankA - rankB;
    });

    setPersonnelData(sortedData);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === 'personnelData') {
            loadData();
        }
    };
    
    window.addEventListener('storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage-update', handleStorageChange);
    };
  }, [loadData]);

  const handleDelete = (personId: number) => {
    const updatedData = personnelData.filter(p => p.id !== personId);
    updateLocalStorage('personnelData', updatedData);
    // The event listener will handle the state update
  };

  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">كشف الأفراد</CardTitle>
          <CardDescription>عرض وإدارة جميع الأفراد المسجلين في النظام.</CardDescription>
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
