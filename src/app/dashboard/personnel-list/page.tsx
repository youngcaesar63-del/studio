
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';

const initialPersonnelData = [
    { id: 1, cardId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم حاسوب', batch: 'الدفعة 65', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'A+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'الخرطوم', city: 'الخرطوم', locality: 'بحري', address: 'شارع النيل', dateOfBirth: new Date('1998-04-15').toISOString(), nationalId: '1234567890', phoneNumbers: { sudani: '0912345678' }, nextOfKinName: 'محمد علي', nextOfKinPhone: '0912345670', nextOfKinAddress: 'الخرطوم، بحري', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
    { id: 2, cardId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', specialization: 'طيار', academicQualification: 'ماجستير', major: 'هندسة طيران', batch: 'الدفعة 62', administration: 'الإدارة العامة للأمن العسكري', status: 'إجازة', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'O+', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الجزيرة', city: 'ود مدني', locality: 'شرق الجزيرة', address: 'حي المطار', dateOfBirth: new Date('1990-05-15').toISOString(), nationalId: '2345678901', phoneNumbers: { zain: '0912345679' }, nextOfKinName: 'خالد سعيد', nextOfKinPhone: '0912345671', nextOfKinAddress: 'ود مدني، حي المطار', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
    { id: 3, cardId: '30006150201236', name: 'علي حسن محمد', rank: 'ملازم أول', specialization: 'مهندس', academicQualification: 'بكالوريوس', major: 'هندسة كهربائية', batch: 'تقانة 15', administration: 'الإدارة العامة للاستخبارات', status: 'دورة تدريبية', statusDetail: 'أساسيات التحليل', appointmentDate: new Date().toISOString(), certificateType: 'موقتة', bloodType: 'B+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'نهر النيل', city: 'عطبرة', locality: 'عطبرة', address: 'حي الداخلة', dateOfBirth: new Date('1995-06-15').toISOString(), nationalId: '3456789012', phoneNumbers: { mtn: '0912345680' }, nextOfKinName: 'حسن محمد', nextOfKinPhone: '0912345672', nextOfKinAddress: 'عطبرة، حي الداخلة', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
    { id: 4, cardId: '30107150201237', name: 'محمود سعيد عبدالله', rank: 'عقيد', specialization: 'ركن', academicQualification: 'دكتوراه', major: 'علاقات دولية', batch: 'الدفعة 50', administration: 'الإدارة العامة للمعلومات الاستراتيجية', status: 'عمليات', statusDetail: 'الحدود الشرقية', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'AB+', maritalStatus: 'متزوج', religion: 'مسلم', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
    { id: 5, cardId: '30208150201238', name: 'يوسف إبراهيم أحمد', rank: 'لواء', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم عسكرية', batch: 'الدفعة 45', administration: 'رئاسة الهيئة', status: 'إلحاق', statusDetail: 'قيادة الأركان المشتركة', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'A-', maritalStatus: 'متزوج', religion: 'مسلم', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
    { id: 6, cardId: '30309150201239', name: 'سالم فهد', rank: 'فريق', specialization: 'لا يوجد', academicQualification: 'ماجستير', major: 'إدارة أعمال', batch: 'الدفعة 40', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'O-', maritalStatus: 'متزوج', religion: 'مسلم', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
    { id: 7, cardId: '30410150201240', name: 'عبدالله تركي', rank: 'فريق أول', specialization: 'لا يوجد', academicQualification: 'دكتوراه', major: 'استراتيجية وأمن قومي', batch: 'الدفعة 38', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'B-', maritalStatus: 'متزوج', religion: 'مسلم', importantJobs: [], serviceOperations: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '', children: [], brothers: [], sisters: [] },
].map(p => ({ ...p, major: p.major || '', importantJobs: p.importantJobs || [], serviceOperations: p.serviceOperations || [], decisiveStorm: p.decisiveStorm || [], trainingCourses: p.trainingCourses || [], serviceHistory: p.serviceHistory || [], medals: p.medals || [], languages: p.languages || [], children: p.children || [], brothers: p.brothers || [], sisters: p.sisters || [], mechanisms: p.mechanisms || [], phoneNumbers: p.phoneNumbers || {} }));

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
    if (data === null || data.length === 0) {
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
    const currentData = getLocalStorage('personnelData', []);
    const updatedData = currentData.filter((p: any) => p.id !== personId);
    updateLocalStorage('personnelData', updatedData);
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
