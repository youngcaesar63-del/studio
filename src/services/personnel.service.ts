
'use client';

import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage-helpers";
import { rankOrder } from "@/lib/constants";

// This file acts as a service layer for personnel data.
// Currently, it uses localStorage to simulate a database.
// In the future, this can be replaced with calls to a real backend (e.g., Tauri commands to SQLite)
// without changing the component-level logic.

export type Personnel = {
  id: number;
  name: string;
  cardId: string;
  rank: string;
  specialization?: string;
  academicQualification?: string;
  major?: string;
  batch?: string;
  administration: string;
  status: string;
  statusDetail?: string;
  statusDate?: string;
  appointmentDate?: string;
  certificateType?: string;
  lastReturnDate?: string;
  transferDate?: string;
  reportingDate?: string;
  bloodType?: string;
  maritalStatus?: string;
  religion?: string;
  notes?: string;
  photo?: string;
  dateOfBirth?: string;
  nationalId?: string;
  phoneNumbers?: {
      sudani?: string;
      zain?: string;
      mtn?: string;
  };
  state?: string;
  city?: string;
  locality?: string;
  address?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinAddress?: string;
  importantJobs?: any[];
  serviceOperations?: any[];
  decisiveStorm?: any[];
  trainingCourses?: any[];
  serviceHistory?: any[];
  medals?: any[];
  languages?: any[];
  fatherName?: string;
  fatherAddress?: string;
  motherName?: string;
  wifeName?: string;
  children?: any[];
  brothers?: any[];
  sisters?: any[];
  mechanisms?: any[];
};

const initialPersonnelData: Personnel[] = [
    { id: 1, cardId: '29804150201234', name: 'أحمد محمد علي', rank: 'نقيب', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم حاسوب', batch: 'الدفعة 65', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'A+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'الخرطوم', city: 'الخرطوم', locality: 'بحري', address: 'شارع النيل', dateOfBirth: new Date('1998-04-15').toISOString(), nationalId: '1234567890', phoneNumbers: { sudani: '0912345678' }, nextOfKinName: 'محمد علي', nextOfKinPhone: '0912345670', nextOfKinAddress: 'الخرطوم، بحري', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 2, cardId: '29905150201235', name: 'محمد خالد سعيد', rank: 'رائد', specialization: 'طيار', academicQualification: 'ماجستير', major: 'هندسة طيران', batch: 'الدفعة 62', administration: 'الإدارة العامة للأمن العسكري', status: 'إجازة', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'O+', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الجزيرة', city: 'ود مدني', locality: 'شرق الجزيرة', address: 'حي المطار', dateOfBirth: new Date('1990-05-15').toISOString(), nationalId: '2345678901', phoneNumbers: { zain: '0912345679' }, nextOfKinName: 'خالد سعيد', nextOfKinPhone: '0912345671', nextOfKinAddress: 'ود مدني، حي المطار', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 3, cardId: '30006150201236', name: 'علي حسن محمد', rank: 'ملازم أول', specialization: 'مهندس', academicQualification: 'بكالوريوس', major: 'هندسة كهربائية', batch: 'تقانة 15', administration: 'الإدارة العامة للاستخبارات', status: 'دورة تدريبية', statusDetail: 'أساسيات التحليل', appointmentDate: new Date().toISOString(), certificateType: 'موقتة', bloodType: 'B+', maritalStatus: 'أعزب', religion: 'مسلم', state: 'نهر النيل', city: 'عطبرة', locality: 'عطبرة', address: 'حي الداخلة', dateOfBirth: new Date('1995-06-15').toISOString(), nationalId: '3456789012', phoneNumbers: { mtn: '0912345680' }, nextOfKinName: 'حسن محمد', nextOfKinPhone: '0912345672', nextOfKinAddress: 'عطبرة، حي الداخلة', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 4, cardId: '30107150201237', name: 'محمود سعيد عبدالله', rank: 'عقيد', specialization: 'ركن', academicQualification: 'دكتوراه', major: 'علاقات دولية', batch: 'الدفعة 50', administration: 'الإدارة العامة للمعلومات الاستراتيجية', status: 'عمليات', statusDetail: 'الحدود الشرقية', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'AB+', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الخرطوم', city: 'أم درمان', locality: 'أمبدة', address: 'حي الروضة', dateOfBirth: new Date('1985-07-20').toISOString(), nationalId: '4567890123', phoneNumbers: { sudani: '0912345681' }, nextOfKinName: 'سعيد عبدالله', nextOfKinPhone: '0912345673', nextOfKinAddress: 'أم درمان، حي الروضة', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 5, cardId: '30208150201238', name: 'يوسف إبراهيم أحمد', rank: 'لواء', specialization: 'لا يوجد', academicQualification: 'بكالوريوس', major: 'علوم عسكرية', batch: 'الدفعة 45', administration: 'رئاسة الهيئة', status: 'إلحاق', statusDetail: 'قيادة الأركان المشتركة', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'A-', maritalStatus: 'متزوج', religion: 'مسلم', state: 'البحر الأحمر', city: 'بورتسودان', locality: 'بورتسودان', address: 'حي الميناء', dateOfBirth: new Date('1980-08-25').toISOString(), nationalId: '5678901234', phoneNumbers: { zain: '0912345682' }, nextOfKinName: 'إبراهيم أحمد', nextOfKinPhone: '0912345674', nextOfKinAddress: 'بورتسودان، حي الميناء', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 6, cardId: '30309150201239', name: 'سالم فهد', rank: 'فريق', specialization: 'لا يوجد', academicQualification: 'ماجستير', major: 'إدارة أعمال', batch: 'الدفعة 40', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'O-', maritalStatus: 'متزوج', religion: 'مسلم', state: 'كسلا', city: 'كسلا', locality: 'كسلا', address: 'حي الجبل', dateOfBirth: new Date('1975-09-30').toISOString(), nationalId: '6789012345', phoneNumbers: { mtn: '0912345683' }, nextOfKinName: 'فهد سالم', nextOfKinPhone: '0912345675', nextOfKinAddress: 'كسلا، حي الجبل', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
    { id: 7, cardId: '30410150201240', name: 'عبدالله تركي', rank: 'فريق أول', specialization: 'لا يوجد', academicQualification: 'دكتوراه', major: 'استراتيجية وأمن قومي', batch: 'الدفعة 38', administration: 'رئاسة الهيئة', status: 'بالطابور', appointmentDate: new Date().toISOString(), certificateType: 'مستديمة', bloodType: 'B-', maritalStatus: 'متزوج', religion: 'مسلم', state: 'الشمالية', city: 'دنقلا', locality: 'دنقلا', address: 'حي القصر', dateOfBirth: new Date('1973-10-05').toISOString(), nationalId: '7890123456', phoneNumbers: { sudani: '0912345684' }, nextOfKinName: 'تركي عبدالله', nextOfKinPhone: '0912345676', nextOfKinAddress: 'دنقلا، حي القصر', importantJobs: [], serviceOperations: [], decisiveStorm: [], trainingCourses: [], serviceHistory: [], medals: [], languages: [], children: [], brothers: [], sisters: [], mechanisms: [], fatherName: '', fatherAddress: '', motherName: '', wifeName: '' },
];


async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getAllPersonnel(): Promise<Personnel[]> {
  await delay(200); // Simulate network delay
  
  let data = getLocalStorage('personnelData', null);
  
  if (data === null || data.length === 0) {
    updateLocalStorage('personnelData', initialPersonnelData);
    data = initialPersonnelData;
  }
    
  const sortedData = data.sort((a: Personnel, b: Personnel) => {
    const rankA = rankOrder[a.rank] || 99;
    const rankB = rankOrder[b.rank] || 99;
    return rankA - rankB;
  });

  return sortedData;
}

export async function getPersonnelById(id: number): Promise<Personnel | undefined> {
  await delay(100);
  const personnelList = getLocalStorage('personnelData', []) as Personnel[];
  return personnelList.find(p => p.id === id);
}

export async function addPersonnel(newPersonnelData: Omit<Personnel, 'id'>): Promise<Personnel> {
  await delay(300);
  const personnelList = getLocalStorage('personnelData', []) as Personnel[];

  // Sort date-based arrays before saving
  newPersonnelData.importantJobs?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
  newPersonnelData.serviceOperations?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
  newPersonnelData.decisiveStorm?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
  newPersonnelData.trainingCourses?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
  newPersonnelData.serviceHistory?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
  newPersonnelData.mechanisms?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
  
  const newPersonnel: Personnel = {
    ...newPersonnelData,
    id: Date.now(),
  };

  const updatedList = [...personnelList, newPersonnel];
  updateLocalStorage('personnelData', updatedList);
  return newPersonnel;
}

export async function updatePersonnel(id: number, updatedData: Partial<Omit<Personnel, 'id'>>): Promise<Personnel> {
    await delay(300);
    const personnelList = getLocalStorage('personnelData', []) as Personnel[];

    // Sort date-based arrays before saving
    updatedData.importantJobs?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    updatedData.serviceOperations?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    updatedData.decisiveStorm?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    updatedData.trainingCourses?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    updatedData.serviceHistory?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    updatedData.mechanisms?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());

    let updatedPersonnel: Personnel | undefined;
    const updatedList = personnelList.map(p => {
        if (p.id === id) {
            updatedPersonnel = { ...p, ...updatedData };
            return updatedPersonnel;
        }
        return p;
    });

    if (!updatedPersonnel) {
        throw new Error("Personnel not found");
    }

    updateLocalStorage('personnelData', updatedList);
    return updatedPersonnel;
}

export async function deletePersonnel(id: number): Promise<void> {
    await delay(200);
    const personnelList = getLocalStorage('personnelData', []) as Personnel[];
    const updatedList = personnelList.filter(p => p.id !== id);

    if (personnelList.length === updatedList.length) {
        throw new Error("Personnel not found to delete");
    }

    updateLocalStorage('personnelData', updatedList);
}
