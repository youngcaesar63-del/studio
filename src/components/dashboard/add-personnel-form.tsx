
'use client';

import { useForm } from 'react-hook-form';
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
import { CalendarIcon, User } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { useState } from 'react';
import Image from 'next/image';

const formSchema = z.object({
  cardId: z.string().min(1, 'رقم البطاقة مطلوب').regex(/^\d*$/, 'رقم البطاقة يجب أن يحتوي على أرقام فقط'),
  rank: z.string().min(1, 'الرتبة مطلوبة'),
  specialization: z.string().optional(),
  fullName: z.string().min(3, 'الاسم الكامل يجب أن يكون ٣ أحرف على الأقل'),
  administration: z.string().min(1, 'الإدارة مطلوبة'),
  appointmentDate: z.date({ required_error: 'تاريخ التعيين مطلوب' }),
  lastReturnDate: z.date().optional(),
  status: z.string().min(1, 'الحالة مطلوبة'),
  bloodType: z.string().min(1, 'فصيلة الدم مطلوبة'),
  maritalStatus: z.string().min(1, 'الحالة الاجتماعية مطلوبة'),
  notes: z.string().optional(),
  photo: z.string().optional(),
});

const ranks = ['رائد', 'عميد', 'عقيد', 'لواء', 'ملازم', 'ملازم أول', 'مقدم', 'نقيب'].sort((a,b) => a.localeCompare(b, 'ar'));
const specializations = ['ركن', 'مهندس', 'بحري', 'طيار', 'مهندس ركن', 'ركن بحري', 'ركن طيار', 'د.ركن', 'مهندس د.ركن', 'تقني', 'خريج', 'لا يوجد'].sort((a,b) => a.localeCompare(b, 'ar'));
const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة'].sort((a,b) => a.localeCompare(b, 'ar'));
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب'].sort((a,b) => a.localeCompare(b, 'ar'));
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const maritalStatuses = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];


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
      administration: '',
      status: 'بالطابور',
      bloodType: '',
      maritalStatus: '',
      notes: '',
      photo: '',
    },
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
    try {
      const storedData = localStorage.getItem('personnelData');
      const personnelList = storedData ? JSON.parse(storedData) : [];
      
      const newPersonnel = {
        id: Date.now(), // Use timestamp for unique ID
        name: values.fullName,
        cardId: values.cardId,
        rank: values.rank,
        specialization: values.specialization,
        administration: values.administration,
        status: values.status,
        appointmentDate: values.appointmentDate.toISOString(),
        lastReturnDate: values.lastReturnDate?.toISOString(),
        bloodType: values.bloodType,
        maritalStatus: values.maritalStatus,
        notes: values.notes,
        photo: values.photo,
      };

      personnelList.push(newPersonnel);
      localStorage.setItem('personnelData', JSON.stringify(personnelList));

      toast({
        title: 'تم الحفظ بنجاح',
        description: `تمت إضافة الفرد ${values.fullName} إلى السجل المحلي.`,
      });
      router.push('/dashboard/personnel-list');

    } catch (error) {
       console.error("Failed to save to localStorage", error);
       toast({
        title: 'خطأ في الحفظ',
        description: `تعذر حفظ بيانات الفرد في السجل المحلي.`,
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

        {/* Personal and Military Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Photo */}
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

            {/* Fields */}
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

                 <FormField control={form.control} name="appointmentDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>تاريخ التعيين</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />

                 <FormField control={form.control} name="lastReturnDate" render={({ field }) => (
                    <FormItem className="flex flex-col"><FormLabel>تاريخ آخر عودة</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
            </div>
        </div>

        {/* Status and Personal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>الحالة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="bloodType" render={({ field }) => (
                <FormItem><FormLabel>فصيلة الدم</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فصيلة الدم" /></SelectTrigger></FormControl><SelectContent>{bloodTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                <FormItem><FormLabel>الحالة الاجتماعية</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة الاجتماعية" /></SelectTrigger></FormControl><SelectContent>{maritalStatuses.map(ms => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
            )} />
        </div>

        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem><FormLabel>ملاحظات</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />

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
