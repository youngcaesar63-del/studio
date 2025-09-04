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
import { CalendarIcon, User, PlusCircle, Trash2, Upload } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { getLocalStorage, updateLocalStorage } from '@/lib/localStorage-helpers';
import { Combobox } from '@/components/ui/combobox';
import { Separator } from '../ui/separator';
import {
  ranks,
  specializations,
  academicQualifications,
  administrations,
  statuses,
  bloodTypes,
  maritalStatuses,
  religions,
  certificateTypes,
  states,
  courseGrades,
  generateBatches
} from '@/lib/constants';

const importantJobSchema = z.object({
  jobTitle: z.string().min(1, 'المسمى الوظيفي مطلوب'),
  periodFrom: z.date({ required_error: 'تاريخ البداية مطلوب' }),
  periodTo: z.date({ required_error: 'تاريخ النهاية مطلوب' }),
});

const serviceOperationSchema = z.object({
  areaName: z.string().min(1, 'اسم المنطقة مطلوب'),
  periodFrom: z.date({ required_error: 'تاريخ البداية مطلوب' }),
  periodTo: z.date({ required_error: 'تاريخ النهاية مطلوب' }),
});

const decisiveStormSchema = z.object({
  name: z.string().min(1, 'اسم الخلية/اللواء/الكتيبة مطلوب'),
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

const serviceHistorySchema = z.object({
  unitName: z.string().min(1, 'اسم الوحدة مطلوب'),
  jobTitle: z.string().min(1, 'الوظيفة مطلوبة'),
  periodFrom: z.date({ required_error: 'تاريخ البداية مطلوب' }),
  periodTo: z.date({ required_error: 'تاريخ النهاية مطلوب' }),
});

const medalSchema = z.object({
    name: z.string().min(1, "اسم الوسام مطلوب"),
});

const languageSchema = z.object({
    name: z.string().min(1, "اسم اللغة مطلوب"),
});

const childSchema = z.object({
    name: z.string().min(1, "اسم الإبن مطلوب"),
});

const brotherSchema = z.object({
    name: z.string().min(1, "اسم الشقيق مطلوب"),
    address: z.string().optional(),
});

const sisterSchema = z.object({
    name: z.string().min(1, "اسم الشقيقة مطلوب"),
    address: z.string().optional(),
});

const mechanismSchema = z.object({
  name: z.string().min(1, 'اسم الآلية مطلوب'),
  periodFrom: z.date({ required_error: 'تاريخ البداية مطلوب' }),
  periodTo: z.date({ required_error: 'تاريخ النهاية مطلوب' }),
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
  religion: z.string().optional(),
  notes: z.string().optional(),
  photo: z.string().optional(),
  dateOfBirth: z.date().optional(),
  nationalId: z.string().optional(),
  phoneNumbers: z.object({
    sudani: z.string().optional(),
    zain: z.string().optional(),
    mtn: z.string().optional(),
  }).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  locality: z.string().optional(),
  address: z.string().optional(),
  nextOfKinName: z.string().optional(),
  nextOfKinPhone: z.string().optional(),
  nextOfKinAddress: z.string().optional(),
  importantJobs: z.array(importantJobSchema).optional(),
  serviceOperations: z.array(serviceOperationSchema).optional(),
  decisiveStorm: z.array(decisiveStormSchema).optional(),
  trainingCourses: z.array(trainingCourseSchema).optional(),
  serviceHistory: z.array(serviceHistorySchema).optional(),
  medals: z.array(medalSchema).optional(),
  languages: z.array(languageSchema).optional(),
  fatherName: z.string().optional(),
  fatherAddress: z.string().optional(),
  motherName: z.string().optional(),
  wifeName: z.string().optional(),
  children: z.array(childSchema).optional(),
  brothers: z.array(brotherSchema).optional(),
  sisters: z.array(sisterSchema).optional(),
  mechanisms: z.array(mechanismSchema).optional(),
});


const batches = generateBatches();

export function AddPersonnelForm() {
  const router = useRouter();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dateFieldOpen, setDateFieldOpen] = useState<{ [key: string]: boolean }>({});

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
      religion: 'مسلم',
      notes: '',
      photo: '',
      nationalId: '',
      phoneNumbers: { sudani: '', zain: '', mtn: '' },
      state: '',
      city: '',
      locality: '',
      address: '',
      nextOfKinName: '',
      nextOfKinPhone: '',
      nextOfKinAddress: '',
      importantJobs: [],
      serviceOperations: [],
      decisiveStorm: [],
      trainingCourses: [],
      serviceHistory: [],
      medals: [],
      languages: [],
      fatherName: '',
      fatherAddress: '',
      motherName: '',
      wifeName: '',
      children: [],
      brothers: [],
      sisters: [],
      mechanisms: [],
    },
  });

  const { fields: jobFields, append: appendJob, remove: removeJob } = useFieldArray({
    control: form.control,
    name: "importantJobs",
  });

  const { fields: serviceFields, append: appendService, remove: removeService } = useFieldArray({
    control: form.control,
    name: "serviceOperations",
  });
  
  const { fields: decisiveStormFields, append: appendDecisiveStorm, remove: removeDecisiveStorm } = useFieldArray({
    control: form.control,
    name: "decisiveStorm",
  });

  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: "trainingCourses",
  });
  
  const { fields: serviceHistoryFields, append: appendServiceHistory, remove: removeServiceHistory } = useFieldArray({
    control: form.control,
    name: "serviceHistory",
  });
  
  const { fields: medalFields, append: appendMedal, remove: removeMedal } = useFieldArray({
    control: form.control,
    name: "medals",
  });

  const { fields: languageFields, append: appendLanguage, remove: removeLanguage } = useFieldArray({
    control: form.control,
    name: "languages",
  });

  const { fields: childrenFields, append: appendChild, remove: removeChild } = useFieldArray({
    control: form.control,
    name: "children",
  });
  
  const { fields: brothersFields, append: appendBrother, remove: removeBrother } = useFieldArray({
    control: form.control,
    name: "brothers",
  });

  const { fields: sistersFields, append: appendSister, remove: removeSister } = useFieldArray({
    control: form.control,
    name: "sisters",
  });

  const { fields: mechanismFields, append: appendMechanism, remove: removeMechanism } = useFieldArray({
    control: form.control,
    name: "mechanisms",
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
    
    // Sort date-based arrays
    values.importantJobs?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    values.serviceOperations?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    values.decisiveStorm?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    values.trainingCourses?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    values.serviceHistory?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());
    values.mechanisms?.sort((a, b) => new Date(a.periodFrom).getTime() - new Date(b.periodFrom).getTime());

    const newPersonnel = {
      id: Date.now(), // Use timestamp for unique ID
      ...values,
      name: values.fullName,
      appointmentDate: values.appointmentDate.toISOString(),
      lastReturnDate: values.lastReturnDate?.toISOString(),
      transferDate: values.transferDate?.toISOString(),
      reportingDate: values.reportingDate?.toISOString(),
      dateOfBirth: values.dateOfBirth?.toISOString(),
      importantJobs: values.importantJobs?.map(job => ({
        ...job,
        periodFrom: job.periodFrom.toISOString(),
        periodTo: job.periodTo.toISOString(),
      })),
      serviceOperations: values.serviceOperations?.map(op => ({
        ...op,
        periodFrom: op.periodFrom.toISOString(),
        periodTo: op.periodTo.toISOString(),
      })),
      decisiveStorm: values.decisiveStorm?.map(op => ({
        ...op,
        periodFrom: op.periodFrom.toISOString(),
        periodTo: op.periodTo.toISOString(),
      })),
      trainingCourses: values.trainingCourses?.map(course => ({
        ...course,
        periodFrom: course.periodFrom.toISOString(),
        periodTo: course.periodTo.toISOString(),
      })),
      serviceHistory: values.serviceHistory?.map(history => ({
        ...history,
        periodFrom: history.periodFrom.toISOString(),
        periodTo: history.periodTo.toISOString(),
      })),
      mechanisms: values.mechanisms?.map(v => ({
        ...v,
        periodFrom: v.periodFrom.toISOString(),
        periodTo: v.periodTo.toISOString(),
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
              <FormItem className="flex flex-col items-center gap-4 lg:col-span-1">
                <FormLabel>الصورة الشخصية</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-4">
                    <div 
                      className="w-40 h-40 rounded-lg border-2 border-dashed flex items-center justify-center bg-muted/50 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {photoPreview ? (
                        <Image src={photoPreview} alt="معاينة الصورة" width={160} height={160} className="rounded-lg object-cover w-full h-full" />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <User className="w-16 h-16 mx-auto" />
                          <p className="text-xs mt-1">انقر للرفع</p>
                        </div>
                      )}
                    </div>
                     <Input 
                      type="file" 
                      accept="image/*" 
                      ref={fileInputRef} 
                      onChange={handlePhotoChange} 
                      className="hidden" 
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="ml-2 h-4 w-4" />
                        اختر صورة
                    </Button>
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
                    <FormItem><FormLabel>تاريخ التعيين</FormLabel>
                    <Popover open={dateFieldOpen['appointmentDate']} onOpenChange={(open) => setDateFieldOpen(prev => ({...prev, appointmentDate: open}))}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>
                                    {field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); }} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="certificateType" render={({ field }) => (
                    <FormItem><FormLabel>نوع البراءة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر نوع البراءة" /></SelectTrigger></FormControl><SelectContent>{certificateTypes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        <Separator className="my-8" />

        <h3 className="text-xl font-semibold mb-4">المعلومات الشخصية</h3>
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                    <FormItem><FormLabel>تاريخ الميلاد</FormLabel>
                    <Popover open={dateFieldOpen['dateOfBirth']} onOpenChange={(open) => setDateFieldOpen(prev => ({...prev, dateOfBirth: open}))}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>
                                    {field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); }} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="nationalId" render={({ field }) => (
                    <FormItem><FormLabel>الرقم الوطني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bloodType" render={({ field }) => (
                    <FormItem><FormLabel>فصيلة الدم</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فصيلة الدم" /></SelectTrigger></FormControl><SelectContent>{bloodTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                    <FormItem><FormLabel>الحالة الاجتماعية</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة الاجتماعية" /></SelectTrigger></FormControl><SelectContent>{maritalStatuses.map(ms => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <FormField control={form.control} name="phoneNumbers.sudani" render={({ field }) => (
                    <FormItem><FormLabel>رقم سوداني</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phoneNumbers.zain" render={({ field }) => (
                    <FormItem><FormLabel>رقم زين</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="phoneNumbers.mtn" render={({ field }) => (
                    <FormItem><FormLabel>رقم MTN</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="religion" render={({ field }) => (
                    <FormItem><FormLabel>الديانة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الديانة" /></SelectTrigger></FormControl><SelectContent>{religions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
            </div>
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
        
        <h3 className="text-xl font-semibold mb-4">المعلومات العائلية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField control={form.control} name="fatherName" render={({ field }) => ( <FormItem><FormLabel>اسم الأب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="fatherAddress" render={({ field }) => ( <FormItem><FormLabel>عنوان الأب</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="motherName" render={({ field }) => ( <FormItem><FormLabel>اسم الأم</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="wifeName" render={({ field }) => ( <FormItem><FormLabel>اسم الزوجة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">الأبناء</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => appendChild({ name: '' })}> <PlusCircle className="ml-2 h-4 w-4" /> إضافة إبن </Button>
            </div>
            <div className="space-y-4">
            {childrenFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                    <FormField control={form.control} name={`children.${index}.name`} render={({ field }) => ( <FormItem className="md:col-span-3"><FormLabel>اسم الإبن</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeChild(index)}> <Trash2 className="h-4 w-4" /> </Button>
                </div>
            ))}
            </div>
        </div>

        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">الأشقاء</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => appendBrother({ name: '', address: '' })}> <PlusCircle className="ml-2 h-4 w-4" /> إضافة شقيق </Button>
            </div>
            <div className="space-y-4">
            {brothersFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                    <FormField control={form.control} name={`brothers.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>اسم الشقيق</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name={`brothers.${index}.address`} render={({ field }) => ( <FormItem className="md:col-span-2"><FormLabel>عنوان الشقيق</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeBrother(index)}> <Trash2 className="h-4 w-4" /> </Button>
                </div>
            ))}
            </div>
        </div>
        
        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">الشقيقات</h4>
                <Button type="button" variant="outline" size="sm" onClick={() => appendSister({ name: '', address: '' })}> <PlusCircle className="ml-2 h-4 w-4" /> إضافة شقيقة </Button>
            </div>
            <div className="space-y-4">
            {sistersFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                    <FormField control={form.control} name={`sisters.${index}.name`} render={({ field }) => ( <FormItem><FormLabel>اسم الشقيقة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={form.control} name={`sisters.${index}.address`} render={({ field }) => ( <FormItem className="md:col-span-2"><FormLabel>عنوان الشقيقة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )}/>
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeSister(index)}> <Trash2 className="h-4 w-4" /> </Button>
                </div>
            ))}
            </div>
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
              <h3 className="text-xl font-semibold">أهم الوظائف التي شغلها</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendJob({ jobTitle: '', periodFrom: new Date(), periodTo: new Date() })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة وظيفة
              </Button>
            </div>
            <div className="space-y-4">
              {jobFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`importantJobs.${index}.jobTitle`} render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>المسمى الوظيفي</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`importantJobs.${index}.periodFrom`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`importantJobs.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeJob(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>

        <Separator className="my-8" />
        
        <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">الوحدات والإدارات والمعاهد التي عمل بها</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendServiceHistory({ unitName: '', jobTitle: '', periodFrom: new Date(), periodTo: new Date() })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة
              </Button>
            </div>
            <div className="space-y-4">
              {serviceHistoryFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`serviceHistory.${index}.unitName`} render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>اسم الوحدة/الإدارة/المعهد</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name={`serviceHistory.${index}.jobTitle`} render={({ field }) => (
                      <FormItem><FormLabel>الوظيفة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`serviceHistory.${index}.periodFrom`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`serviceHistory.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeServiceHistory(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`serviceOperations.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
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
              <h3 className="text-xl font-semibold">خلايا وألوية وكتائب عاصفة الحزم</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendDecisiveStorm({ name: '', periodFrom: new Date(), periodTo: new Date() })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة مشاركة
              </Button>
            </div>
            <div className="space-y-4">
              {decisiveStormFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`decisiveStorm.${index}.name`} render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>اسم الخلية/اللواء/الكتيبة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`decisiveStorm.${index}.periodFrom`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`decisiveStorm.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeDecisiveStorm(index)}>
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
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`trainingCourses.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <Button type="button" variant="destructive" size="icon" onClick={() => removeCourse(index)}>
                      <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
        </div>

        <Separator className="my-8" />
        
        <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">الأوسمة والأنواط</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendMedal({ name: '' })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة وسام
              </Button>
            </div>
            <div className="space-y-4">
              {medalFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`medals.${index}.name`} render={({ field }) => (
                      <FormItem className="md:col-span-3"><FormLabel>اسم الوسام / النوط</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeMedal(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>

        <Separator className="my-8" />

        <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">اللغات واللهجات</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendLanguage({ name: '' })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة لغة
              </Button>
            </div>
            <div className="space-y-4">
              {languageFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`languages.${index}.name`} render={({ field }) => (
                      <FormItem className="md:col-span-3"><FormLabel>اسم اللغة / اللهجة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeLanguage(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
        </div>
        
        <Separator className="my-8" />

        <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">الآليات</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => appendMechanism({ name: '', periodFrom: new Date(), periodTo: new Date() })}>
                  <PlusCircle className="ml-2 h-4 w-4" />
                  إضافة آلية
              </Button>
            </div>
            <div className="space-y-4">
              {mechanismFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/50 items-end">
                   <FormField control={form.control} name={`mechanisms.${index}.name`} render={({ field }) => (
                      <FormItem className="md:col-span-2"><FormLabel>اسم الآلية</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`mechanisms.${index}.periodFrom`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة من</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                   <FormField control={form.control} name={`mechanisms.${index}.periodTo`} render={({ field }) => (
                      <FormItem><FormLabel>الفترة إلى</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                  )} />
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="icon" onClick={() => removeMechanism(index)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
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
            <FormField control={form.control} name="transferDate" render={({ field }) => (
              <FormItem><FormLabel>تاريخ النقل</FormLabel>
                <Popover open={dateFieldOpen['transferDate']} onOpenChange={(open) => setDateFieldOpen(prev => ({...prev, transferDate: open}))}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); }} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                    </PopoverContent>
                </Popover>
              <FormMessage />
              </FormItem>
            )} />
             <FormField control={form.control} name="reportingDate" render={({ field }) => (
              <FormItem><FormLabel>تاريخ التبليغ</FormLabel>
                <Popover open={dateFieldOpen['reportingDate']} onOpenChange={(open) => setDateFieldOpen(prev => ({...prev, reportingDate: open}))}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); }} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                    </PopoverContent>
                </Popover>
              <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="lastReturnDate" render={({ field }) => (
                <FormItem><FormLabel>تاريخ آخر عودة</FormLabel>
                <Popover open={dateFieldOpen['lastReturnDate']} onOpenChange={(open) => setDateFieldOpen(prev => ({...prev, lastReturnDate: open}))}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal h-10", !field.value && "text-muted-foreground")}>
                                {field.value ? (format(field.value, "d MMMM yyyy", { locale: arSA })) : (<span>اختر تاريخ</span>)}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={(date) => { field.onChange(date); }} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                    </PopoverContent>
                </Popover>
                <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem className="md:col-span-2 lg:col-span-3"><FormLabel>معلومات إضافية</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
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
