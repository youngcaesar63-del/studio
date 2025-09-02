
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
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';

const formSchema = z.object({
  fullName: z.string().min(3, 'الاسم الكامل يجب أن يكون ٣ أحرف على الأقل'),
  cardId: z.string().min(1, 'رقم البطاقة مطلوب').regex(/^\d+$/, 'رقم البطاقة يجب أن يحتوي على أرقام فقط'),
  rank: z.string().min(1, 'الرتبة مطلوبة'),
  administration: z.string().min(1, 'الإدارة مطلوبة'),
  appointmentDate: z.date({ required_error: 'تاريخ التعيين مطلوب' }),
  status: z.string().min(1, 'الحالة مطلوبة'),
  bloodType: z.string().min(1, 'فصيلة الدم مطلوبة'),
  maritalStatus: z.string().min(1, 'الحالة الاجتماعية مطلوبة'),
  notes: z.string().optional(),
});

const ranks = ['رائد', 'عميد', 'عقيد', 'لواء', 'ملازم', 'ملازم أول', 'مقدم', 'نقيب'].sort((a,b) => a.localeCompare(b, 'ar'));
const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة'].sort((a,b) => a.localeCompare(b, 'ar'));
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب'].sort((a,b) => a.localeCompare(b, 'ar'));
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const maritalStatuses = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];


export function AddPersonnelForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      cardId: '',
      rank: '',
      administration: '',
      status: 'بالطابور',
      bloodType: '',
      maritalStatus: '',
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const storedData = localStorage.getItem('personnelData');
      const personnelList = storedData ? JSON.parse(storedData) : [];
      
      const newPersonnel = {
        id: Date.now(), // Use timestamp for unique ID
        name: values.fullName,
        cardId: values.cardId,
        rank: values.rank,
        administration: values.administration,
        status: values.status,
        appointmentDate: values.appointmentDate.toISOString(),
        bloodType: values.bloodType,
        maritalStatus: values.maritalStatus,
        notes: values.notes,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={form.control} name="fullName" render={({ field }) => (
          <FormItem><FormLabel>الاسم الكامل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="cardId" render={({ field }) => (
          <FormItem><FormLabel>رقم البطاقة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="rank" render={({ field }) => (
          <FormItem><FormLabel>الرتبة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الرتبة" /></SelectTrigger></FormControl><SelectContent>{ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="administration" render={({ field }) => (
          <FormItem><FormLabel>الإدارة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الإدارة" /></SelectTrigger></FormControl><SelectContent>{administrations.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="appointmentDate" render={({ field }) => (
          <FormItem className="flex flex-col"><FormLabel>تاريخ التعيين</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="status" render={({ field }) => (
          <FormItem><FormLabel>الحالة</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="bloodType" render={({ field }) => (
          <FormItem><FormLabel>فصيلة الدم</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فصيلة الدم" /></SelectTrigger></FormControl><SelectContent>{bloodTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="maritalStatus" render={({ field }) => (
          <FormItem><FormLabel>الحالة الاجتماعية</FormLabel><Select dir="rtl" onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة الاجتماعية" /></SelectTrigger></FormControl><SelectContent>{maritalStatuses.map(ms => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="notes" render={({ field }) => (
          <FormItem className="md:col-span-2"><FormLabel>ملاحظات</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="md:col-span-2 flex justify-end space-x-4 rtl:space-x-reverse">
          <Button type="button" variant="outline" onClick={() => router.back()}>إلغاء</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
