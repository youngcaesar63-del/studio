
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Edit, GraduationCap, User } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';

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
});

type Personnel = z.infer<typeof formSchema> & { id: number; name: string; appointmentDate: string; certificateType: string; lastReturnDate?: string; transferDate?: string; reportingDate?: string; photo?: string; dateOfBirth?: string; };

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

export default function EditPersonnelPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fullName: '',
        cardId: '',
        rank: '',
        specialization: '',
        academicQualification: '',
        batch: '',
        administration: '',
        certificateType: '',
        status: '',
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
      },
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const personnelList: Personnel[] = getLocalStorage('personnelData', []);
    const personToEdit = personnelList.find(p => p.id === id);
    if (personToEdit) {
      form.reset({
        fullName: personToEdit.name,
        cardId: personToEdit.cardId,
        rank: personToEdit.rank,
        specialization: personToEdit.specialization || 'لا يوجد',
        academicQualification: personToEdit.academicQualification || 'لا يوجد',
        batch: personToEdit.batch || 'لا يوجد',
        administration: personToEdit.administration,
        status: personToEdit.status,
        appointmentDate: personToEdit.appointmentDate ? new Date(personToEdit.appointmentDate) : new Date(),
        certificateType: personToEdit.certificateType || 'مستديمة',
        lastReturnDate: personToEdit.lastReturnDate ? new Date(personToEdit.lastReturnDate) : undefined,
        transferDate: personToEdit.transferDate ? new Date(personToEdit.transferDate) : undefined,
        reportingDate: personToEdit.reportingDate ? new Date(personToEdit.reportingDate) : undefined,
        bloodType: personToEdit.bloodType || '',
        maritalStatus: personToEdit.maritalStatus || '',
        notes: personToEdit.notes || '',
        photo: personToEdit.photo || '',
        dateOfBirth: personToEdit.dateOfBirth ? new Date(personToEdit.dateOfBirth) : undefined,
        nationalId: personToEdit.nationalId || '',
        phoneNumber: personToEdit.phoneNumber || '',
        state: personToEdit.state || '',
        city: personToEdit.city || '',
        locality: personToEdit.locality || '',
        address: personToEdit.address || '',
      });
      if (personToEdit.photo) {
        setPhotoPreview(personToEdit.photo);
      }
    } else {
        toast({ title: 'خطأ', description: 'الفرد غير موجود.', variant: 'destructive' });
        router.push('/dashboard/personnel-list');
    }
    setLoading(false);
  }, [id, form, router]);

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
    let personnelList: Personnel[] = getLocalStorage('personnelData', []);
    
    const updatedList = personnelList.map(p => {
      if (p.id === id) {
        return {
          ...p,
          name: values.fullName,
          cardId: values.cardId,
          rank: values.rank,
          specialization: values.specialization,
          academicQualification: values.academicQualification,
          batch: values.batch,
          administration: values.administration,
          status: values.status,
          appointmentDate: values.appointmentDate.toISOString(),
          certificateType: values.certificateType,
          lastReturnDate: values.lastReturnDate?.toISOString(),
          transferDate: values.transferDate?.toISOString(),
          reportingDate: values.reportingDate?.toISOString(),
          bloodType: values.bloodType,
          maritalStatus: values.maritalStatus,
          notes: values.notes,
          photo: values.photo,
          dateOfBirth: values.dateOfBirth?.toISOString(),
          nationalId: values.nationalId,
          phoneNumber: values.phoneNumber,
          state: values.state,
          city: values.city,
          locality: values.locality,
          address: values.address,
        };
      }
      return p;
    });

    updateLocalStorage('personnelData', updatedList);

    toast({
      title: 'تم التحديث بنجاح',
      description: `تم تحديث بيانات الفرد ${values.fullName}.`,
    });
    router.push('/dashboard/personnel-list');
  }

  if (loading) {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /> <Skeleton className="h-8 w-48" /></CardTitle>
                <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <div className="md:col-span-2">
                    <Skeleton className="h-24 w-full" />
                </div>
                 <div className="md:col-span-2 flex justify-end gap-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="animate-in fade-in duration-500">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2"><Edit className="h-6 w-6" />تعديل بيانات فرد</CardTitle>
          <CardDescription>قم بتحديث البيانات المطلوبة ثم اضغط على حفظ.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
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
                            <FormItem><FormLabel>الإدارة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الإدارة" /></SelectTrigger></FormControl><SelectContent>{administrations.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="rank" render={({ field }) => (
                            <FormItem><FormLabel>الرتبة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الرتبة" /></SelectTrigger></FormControl><SelectContent>{ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="specialization" render={({ field }) => (
                            <FormItem><FormLabel>التخصص</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger></FormControl><SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="academicQualification" render={({ field }) => (
                            <FormItem><FormLabel>المؤهل الأكاديمي</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر المؤهل" /></SelectTrigger></FormControl><SelectContent>{academicQualifications.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
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
                            <FormItem className="flex flex-col"><FormLabel>تاريخ التعيين</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="certificateType" render={({ field }) => (
                            <FormItem><FormLabel>نوع البراءة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع البراءة" /></SelectTrigger></FormControl><SelectContent>{certificateTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                        )} />
                    </div>
                </div>
                 <Separator className="my-8" />

                <h3 className="text-xl font-semibold mb-4">المعلومات الشخصية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>تاريخ الميلاد</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="nationalId" render={({ field }) => (
                        <FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem><FormLabel>رقم الهاتف</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="bloodType" render={({ field }) => (
                        <FormItem><FormLabel>فصيلة الدم</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فصيلة الدم" /></SelectTrigger></FormControl><SelectContent>{bloodTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                        <FormItem><FormLabel>الحالة الاجتماعية</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة الاجتماعية" /></SelectTrigger></FormControl><SelectContent>{maritalStatuses.map(ms => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                 <Separator className="my-8" />
                
                <h3 className="text-xl font-semibold mb-4">بيانات العنوان</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem><FormLabel>الولاية</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الولاية" /></SelectTrigger></FormControl><SelectContent>{states.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
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

                <h3 className="text-xl font-semibold mb-4">معلومات إضافية</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField control={form.control} name="status" render={({ field }) => (
                        <FormItem><FormLabel>الحالة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastReturnDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>تاريخ آخر عودة</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="transferDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>تاريخ النقل</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="reportingDate" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>تاريخ التبليغ</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="notes" render={({ field }) => (
                    <FormItem><FormLabel>ملاحظات</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex justify-end space-x-4 rtl:space-x-reverse pt-4 border-t">
                    <Button type="button" variant="outline" onClick={() => router.back()}>إلغاء</Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </Button>
                </div>
            </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
