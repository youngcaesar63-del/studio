
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonnelTable } from '@/components/dashboard/personnel-table';
import { Skeleton } from '@/components/ui/skeleton';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';
import { rankOrder } from '@/lib/constants';

const initialPersonnelData = [
    { id: 1, cardId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم حاسوب', batch: 'الدفعة 65', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'A+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'الخرطوم', city: 'الخرطوم', locality: 'بحري', address: 'شارع النيل', dateOfBirth: new Date('1998-04-15').toISOString(), nationalId: '1234567890', phoneNumbers: { sudani: '0912345678' }, nextOfKinName: 'محمد علي', nextOfKinPhone: '0912345670', nextOfKinAddress: 'الخرطوم، بحري', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 2, cardId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', specialization: 'طيار', academicQualification: 'ماجستير', major: 'هندسة طيران', batch: 'الدفعة 62', administration: 'الإدارة العامة للأمن العسكري', status: 'إجازة', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'O+', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الجزيرة', city: 'ود مدني', locality: 'شرق الجزيرة', address: 'حي المطار', dateOfBirth: new Date('1990-05-15').toISOString(), nationalId: '2345678901', phoneNumbers: { zain: '0912345679' }, nextOfKinName: 'خالد سعيد', nextOfKinPhone: '0912345671', nextOfKinAddress: 'ود مدني، حي المطار', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 3, cardId: '30006150201236', name: 'علي حسن محمد', rank: 'ملازم أول', specialization: 'مهندس', academicQualification: 'بكالوريوس', major: 'هندسة كهربائية', batch: 'تقانة 15', administration: 'الإدارة العامة للاستخبارات', status: 'دورة تدريبية', statusDetail: 'أساسيات التحليل', appointmentDate: new Date().toISOString(), certificateType: 'موقتة', bloodType: 'B+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'نهر النيل', city: 'عطبرة', locality: 'عطبرة', address: 'حي الداخلة', dateOfBirth: new Date('1995-06-15').toISOString(), nationalId: '3456789012', phoneNumbers: { mtn: '0912345680' }, nextOfKinName: 'حسن محمد', nextOfKinPhone: '0912345672', nextOfKinAddress: 'عطبرة، حي الداخلة', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 4, cardId: '30107150201237', name: 'محمود سعيد عبدالله', rank: 'عقيد', specialization: 'ركن', academicQualification: 'دكتوراه', major: 'علاقات دولية', batch: 'الدفعة 50', administration: 'الإدارة العامة للمعلومات الاستراتيجية', status: 'عمليات', statusDetail: 'الحدود الشرقية', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'AB+', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الخرطوم', city: 'أم درمان', locality: 'أمبدة', address: 'حي الروضة', dateOfBirth: new Date('1985-07-20').toISOString(), nationalId: '4567890123', phoneNumbers: { sudani: '0912345681' }, nextOfKinName: 'سعيد عبدالله', nextOfKinPhone: '0912345673', nextOfKinAddress: 'أم درمان، حي الروضة', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 5, cardId: '30208150201238', name: 'يوسف إبراهيم أحمد', rank: 'لواء', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم عسكرية', batch: 'الدفعة 45', administration: 'رئاسة الهيئة', status: 'إلحاق', statusDetail: 'قيادة الأركان المشتركة', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'A-', maritalStatus: 'متزوج', religion: 'مسلم', state: 'البحر الأحمر', city: 'بورتسودان', locality: 'بورتسودان', address: 'حي الميناء', dateOfBirth: new Date('1980-08-25').toISOString(), nationalId: '5678901234', phoneNumbers: { zain: '0912345682' }, nextOfKinName: 'إبراهيم أحمد', nextOfKinPhone: '0912345674', nextOfKinAddress: 'بورتسودان، حي الميناء', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 6, cardId: '30309150201239', name: 'سالم فهد', rank: 'فريق', specialization: 'لا يوجد', academicQualification: 'ماجستير', major: 'إدارة أعمال', batch: 'الدفعة 40', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'O-', maritalStatus: 'متزوج', religion: 'مسلم', state: 'كسلا', city: 'كسلا', locality: 'كسلا', address: 'حي الجبل', dateOfBirth: new Date('1975-09-30').toISOString(), nationalId: '6789012345', phoneNumbers: { mtn: '0912345683' }, nextOfKinName: 'فهد سالم', nextOfKinPhone: '0912345675', nextOfKinAddress: 'كسلا، حي الجبل', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 7, cardId: '30410150201240', name: 'عبدالله تركي', rank: 'فريق أول', specialization: 'لا يوجد', academicQualification: 'دكتوراه', major: 'استراتيجية وأمن قومي', batch: 'الدفعة 38', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'B-', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الشمالية', city: 'دنقلا', locality: 'دنقلا', address: 'حي القصر', dateOfBirth: new Date('1973-10-05').toISOString(), nationalId: '7890123456', phoneNumbers: { sudani: '0912345684' }, nextOfKinName: 'تركي عبدالله', nextOfKinPhone: '0912345676', nextOfKinAddress: 'دنقلا، حي القصر', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
];


export default function PersonnelListPage() {
  const [personnelData, setPersonnelData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    let data = getLocalStorage('personnelData', null);
    if (data === null || data.length === 0) {
      updateLocalStorage('personnelData', initialPersonnelData);
      data = initialPersonnelData;
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
        if (customEvent.detail.key === 'personnelData' || customEvent.detail.key === 'all') {
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
