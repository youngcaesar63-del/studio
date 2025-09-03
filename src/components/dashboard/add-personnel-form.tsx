
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, User, PlusCircle, Trash2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import Image from 'next/image';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '../ui/separator';

const serviceOperationSchema = z.object({
  areaName: z.string().min(1, 'اسم المنطقة مطلوب'),
  periodFrom: z.date({ required_error: 'تاريخ البداية مطلوب' }),
  periodTo: z.date({ required_error: 'تاريخ النهاية مطلوب' }),
});

const trainingCourseSchema = z.object({
  courseName: z.string().min(1, 'اسم الدورة مطلوب'),
  courseType: z.string().min(1, 'نوع الدورة مطلوب'),
  imperativeness: z.string().min(1, 'حتمية الدورة مطلوبة'),
  institute: z.string().min(1, 'اسم المعهد مطلوب'),
  periodFrom: z.date({ required_error: 'تاريخ البداية مطلوب' }),
  periodTo: z.date({ required_error: 'تاريخ النهاية مطلوب' }),
  grade: z.string().optional(),
});

const formSchema = z.object({
  cardId: z.string().min(1, 'رقم البطاقة مطلوب').regex(/^\d*$/, 'رقم البطاقة يجب أن يحتوي على أرقام فقط'),
  rank: z.string().min(1, 'الرتبة مطلوبة'),
  specialization: z.string().optional(),
  fullName: z.string().min(3, 'الاسم الكامل يجب أن يكون ٣ أحرف على الأقل'),
  batch: z.string().optional(),
  academicQualification: z.string().optional(),
  administration: z.string().min(1, 'الإدارة مطلوبة'),
  appointmentDate: z.date({ required_error: 'تاريخ التعيين مطلوب' }),
  certificateType: z.string().min(1, 'نوع البراءة مطلوب'),
  lastReturnDate: z.date().optional(),
  transferDate: z.date().optional(),
  reportingDate: z.date().optional(),
  status: z.string().min(1, 'الحالة مطلوبة'),
  bloodType: z.string().min(1, 'فصيلة الدم مطلوبة'),
  maritalStatus: z.string().min(1, 'الحالة الاجتماعية مطلوبة'),
  notes: z.string().optional(),
  photo: z.string().optional(),
  dateOfBirth: z.date().optional(),
  nationalId: z.string().optional(),
  phoneNumber: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  address: z.string().optional(),
  nextOfKinName: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinAddress: z.string().optional(),
  serviceOperations: z.array(serviceOperationSchema).optional(),
  trainingCourses: z.array(trainingCourseSchema).optional(),
});

const ranks = ['فريق أول', 'فريق', 'لواء', 'عميد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم أول', 'ملازم'].sort((a,b) => {
    const rankOrder: { [key: string]: number } = { 'فريق أول': 1, 'فريق': 2, 'لواء': 3, 'عميد': 4, 'عقيد': 5, 'مقدم': 6, 'رائد': 7, 'نقيب': 8, 'ملازم أول': 9, 'ملازم': 10 };
    return (rankOrder[a] || 99) - (rankOrder[b] || 99);
});
const specializations = ['ركن', 'مهندس', 'بحري', 'طيار', 'مهندس ركن', 'ركن بحري', 'ركن طيار', 'د.ركن', 'مهندس د.ركن', 'تقني', 'خريج', 'لا يوجد'].sort((a,b) => a.localeCompare(b, 'ar'));
const academicQualifications = ['شهادة إبتدائية', 'شهادة متوسطة', 'شهادة ثانوية', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', 'لا يوجد'].sort((a,b) => a.localeCompare(b, 'ar'));
const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة'].sort((a,b) => a.localeCompare(b, 'ar'));
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب'].sort((a,b) => a.localeCompare(b, 'ar'));
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const maritalStatuses = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];
const certificateTypes = ['مستديمة', 'موقتة'];
const states = ["الخرطوم", "الجزيرة", "البحر الأحمر", "كسلا", "القضارف", "سنار", "النيل الأبيض", "النيل الأزرق", "الشمالية", "نهر النيل", "غرب كردفان", "جنوب كردفان", "شمال دارفور", "غرب دارفور", "جنوب دارفور", "شرق دارفور", "وسط دارفور"].sort((a,b) => a.localeCompare(b, 'ar'));
const courseGrades = ['أ', 'ب', 'جـ', 'د'];


const generateBatches = () => {
  const batches: { value: string, label: string }[] = [];
  for (let i = 70; i >= 30; i--) batches.push({ value: `الدفعة ${i}`, label: `الدفعة ${i}` });
  for (let i = 25; i >= 1; i--) batches.push({ value: `تقانة ${i}`, label: `تقانة ${i}` });
  for (let i = 3; i >= 1; i--) batches.push({ value: `جامعيين ${i}`, label: `جامعيين ${i}` });
  for (let i = 40; i >= 1; i--) batches.push({ value: `فنيين ${i}`, label: `فنيين ${i}` });
  for (let i = 20; i >= 1; i--) batches.push({ value: `تأهيلية ${i}`, label: `تأهيلية ${i}` });
  for (let i = 10; i >= 1; i--) batches.push({ value: `اكرامية ${i}`, label: `اكرامية ${i}` });
  batches.push({ value: 'لا يوجد', label: 'لا يوجد' });
  return batches.reverse();
};
const batches = generateBatches();

export function AddPersonnelForm() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      cardId: '',
      rank: '',
      specialization: 'لا يوجد',
      academicQualification: 'لا يوجد',
      batch: 'لا يوجد',
      administration: '',
      certificateType: '',
      status: 'بالطابور',
      bloodType: '',
      maritalStatus: '',
      notes: '',
      photo: '',
      nationalId: '',
      phoneNumber: '',
      state: '',
      city: '',
      locality: '',
      address: '',
      nextOfKinName: '',
      nextOfKinPhone: '',
      nextOfKinAddress: '',
      serviceOperations: [],
      trainingCourses: [],
    },
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "serviceOperations",
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: "trainingCourses",
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        form.setValue('photo', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const personnelList = getLocalStorage('personnelData', []);
    
    const newPersonnel = {
      id: Date.now(), // Use timestamp for unique ID
      ...values,
      name: values.fullName,
      appointmentDate: values.appointmentDate.toISOString(),
      lastReturnDate: values.lastReturnDate?.toISOString(),
      transferDate: values.transferDate?.toISOString(),
      reportingDate: values.reportingDate?.toISOString(),
      dateOfBirth: values.dateOfBirth?.toISOString(),
      serviceOperations: values.serviceOperations?.map(op => ({
        ...op,
        periodFrom: op.periodFrom.toISOString(),
        periodTo: op.periodTo.toISOString(),
      })),
      trainingCourses: values.trainingCourses?.map(course => ({
        ...course,
        periodFrom: course.periodFrom.toISOString(),
        periodTo: course.periodTo.toISOString(),
      })),
    };

    const updatedList = [...personnelList, newPersonnel];
    updateLocalStorage('personnelData', updatedList);

    toast({
      title: 'تم الحفظ بنجاح',
      description: `تمت إضافة الفرد ${values.fullName} إلى السجل.`,
    });
    router.push('/dashboard/personnel-list');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <FormField control={form.control} name="photo" render={({ field }) => (
              <FormItem className="flex flex-col items-center gap-2 lg:col-span-1">
                <FormLabel>الصورة الشخصية</FormLabel>
                <FormControl>
                  <div className='flex flex-col items-center gap-2'>
                    <div className="w-40 h-40 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50">
                      {photoPreview ? (
                        <Image src={photoPreview} alt="معاينة الصورة" width={160} height={160} className="rounded-lg object-cover w-full h-full" />
                      ) : (
                        <User className="w-20 h-20 text-muted-foreground" />
                      )}
                    </div>
                    <Input type="file" accept="image/*" onChange={handlePhotoChange} className="max-w-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:col-span-2">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>الاسم الكامل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="cardId" render={({ field }) => (
                    <FormItem><FormLabel>رقم البطاقة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="administration" render={({ field }) => (
                    <FormItem><FormLabel>الإدارة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الإدارة" /></SelectTrigger></FormControl><SelectContent>{administrations.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="rank" render={({ field }) => (
                    <FormItem><FormLabel>الرتبة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الرتبة" /></SelectTrigger></FormControl><SelectContent>{ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="specialization" render={({ field }) => (
                    <FormItem><FormLabel>التخصص</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger></FormControl><SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="academicQualification" render={({ field }) => (
                    <FormItem><FormLabel>المؤهل الأكاديمي</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر المؤهل" /></SelectTrigger></FormControl><SelectContent>{academicQualifications.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="batch" render={({ field }) => (
                    <FormItem><FormLabel>الدفعة</FormLabel>
                     <Combobox
                        options={batches}
                        value={field.value}
                        onChange={(value) => form.setValue('batch', value)}
                        placeholder="اختر الدفعة..."
                        filterPlaceholder="ابحث عن دفعة..."
                      />
                    <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="appointmentDate" render={({ field }) => (
                    <FormItem><FormLabel>تاريخ التعيين</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="certificateType" render={({ field }) => (
                    <FormItem><FormLabel>نوع البراءة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع البراءة" /></SelectTrigger></FormControl><SelectContent>{certificateTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        <Separator className="my-8" />

        <h3 className="text-xl font-semibold mb-4">المعلومات الشخصية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                <FormItem><FormLabel>تاريخ الميلاد</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="nationalId" render={({ field }) => (
                <FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="bloodType" render={({ field }) => (
                <FormItem><FormLabel>فصيلة الدم</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فصيلة الدم" /></SelectTrigger></FormControl><SelectContent>{bloodTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                <FormItem><FormLabel>الحالة الاجتماعية</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة الاجتماعية" /></SelectTrigger></FormControl><SelectContent>{maritalStatuses.map(ms => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
        </div>

        <Separator className="my-8" />
        
        <h3 className="text-xl font-semibold mb-4">بيانات العنوان</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField control={form.control} name="state" render={({ field }) => (
                <FormItem><FormLabel>الولاية</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الولاية" /></SelectTrigger></FormControl><SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="city" render={({ field }) => (
                <FormItem><FormLabel>المدينة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="locality" render={({ field }) => (
                <FormItem><FormLabel>المحلية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>العنوان بالتفصيل</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        
        <Separator className="my-8" />
        
        <h3 className="text-xl font-semibold mb-4">بيانات أقرب الأقربين</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField control={form.control} name="nextOfKinName" render={({ field }) => (
                <FormItem><FormLabel>اسم القريب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="nextOfKinPhone" render={({ field }) => (
                <FormItem><FormLabel>رقم هاتف القريب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
             <FormField control={form.control} name="nextOfKinAddress" render={({ field }) => (
                <FormItem className="lg:col-span-3"><FormLabel>عنوان القريب</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>


        <Separator className="my-8" />
        
        <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">مناطق خدمة العمليات</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendService({ areaName: '', periodFrom: new Date(), periodTo: new Date() })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة منطقة خدمة
              </Button>
            </div>
            <div className="space-y-4">
              {serviceFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`serviceOperations.${index}.areaName`} render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>اسم المنطقة / الوحدة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`serviceOperations.${index}.periodFrom`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`serviceOperations.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeService(index)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
        </div>

        <Separator className="my-8" />
        
        <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">الدورات التدريبية</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendCourse({ courseName: '', courseType: 'داخلية', imperativeness: 'حتمية', institute: '', periodFrom: new Date(), periodTo: new Date(), grade: 'أ' })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة دورة تدريبية
              </Button>
            </div>
            <div className="space-y-4">
              {courseFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`trainingCourses.${index}.courseName`} render={({ field }) => (
                      <FormItem><FormLabel>اسم الدورة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`trainingCourses.${index}.institute`} render={({ field }) => (
                      <FormItem><FormLabel>المعهد</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`trainingCourses.${index}.courseType`} render={({ field }) => (
                    <FormItem><FormLabel>النوع</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger></FormControl><SelectContent><SelectItem value="داخلية">داخلية</SelectItem><SelectItem value="خارجية">خارجية</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`trainingCourses.${index}.imperativeness`} render={({ field }) => (
                    <FormItem><FormLabel>الحتمية</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحتمية" /></SelectTrigger></FormControl><SelectContent><SelectItem value="حتمية">حتمية</SelectItem><SelectItem value="غير حتمية">غير حتمية</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`trainingCourses.${index}.grade`} render={({ field }) => (
                    <FormItem><FormLabel>التقدير</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر التقدير" /></SelectTrigger></FormControl><SelectContent>{courseGrades.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`trainingCourses.${index}.periodFrom`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`trainingCourses.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeCourse(index)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
        </div>

        <Separator className="my-8" />

        <h3 className="text-xl font-semibold mb-4">معلومات إضافية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>الحالة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastReturnDate" render={({ field }) => (
                <FormItem><FormLabel>تاريخ آخر عودة</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="transferDate" render={({ field }) => (
              <FormItem><FormLabel>تاريخ النقل</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="reportingDate" render={({ field }) => (
              <FormItem><FormLabel>تاريخ التبليغ</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>ملاحظات</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </div>
        <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>إلغاء</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
