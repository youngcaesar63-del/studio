
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
import { CalendarIcon, Edit } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  cardId: z.string().min(1, 'رقم البطاقة مطلوب').regex(/^\d+$/, 'رقم البطاقة يجب أن يحتوي على أرقام فقط'),
  rank: z.string().min(1, 'الرتبة مطلوبة'),
  specialization: z.string().optional(),
  fullName: z.string().min(3, 'الاسم الكامل يجب أن يكون ٣ أحرف على الأقل'),
  administration: z.string().min(1, 'الإدارة مطلوبة'),
  appointmentDate: z.date({ required_error: 'تاريخ التعيين مطلوب' }),
  status: z.string().min(1, 'الحالة مطلوبة'),
  bloodType: z.string().min(1, 'فصيلة الدم مطلوبة'),
  maritalStatus: z.string().min(1, 'الحالة الاجتماعية مطلوبة'),
  notes: z.string().optional(),
});

type Personnel = z.infer<typeof formSchema> & { id: number; name: string; appointmentDate: string };

const ranks = ['رائد', 'عميد', 'عقيد', 'لواء', 'ملازم', 'ملازم أول', 'مقدم', 'نقيب'].sort((a,b) => a.localeCompare(b, 'ar'));
const specializations = ['ركن', 'مهندس', 'بحري', 'طيار', 'مهندس ركن', 'ركن بحري', 'ركن طيار', 'د.ركن', 'مهندس د.ركن', 'تقني', 'خريج', 'لا يوجد'].sort((a,b) => a.localeCompare(b, 'ar'));
const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة'].sort((a,b) => a.localeCompare(b, 'ar'));
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب'].sort((a,b) => a.localeCompare(b, 'ar'));
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const maritalStatuses = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];

export default function EditPersonnelPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fullName: '',
        cardId: '',
        rank: '',
        specialization: '',
        administration: '',
        status: '',
        bloodType: '',
        maritalStatus: '',
        notes: '',
      },
  });

  useEffect(() => {
    if (!id) return;
    try {
      const storedData = localStorage.getItem('personnelData');
      if (storedData) {
        const personnelList: Personnel[] = JSON.parse(storedData);
        const personToEdit = personnelList.find(p => p.id === id);
        if (personToEdit) {
          form.reset({
            fullName: personToEdit.name,
            cardId: personToEdit.cardId,
            rank: personToEdit.rank,
            specialization: personToEdit.specialization || 'لا يوجد',
            administration: personToEdit.administration,
            status: personToEdit.status,
            appointmentDate: personToEdit.appointmentDate ? new Date(personToEdit.appointmentDate) : new Date(),
            bloodType: personToEdit.bloodType || '',
            maritalStatus: personToEdit.maritalStatus || '',
            notes: personToEdit.notes || '',
          });
        } else {
            toast({ title: 'خطأ', description: 'الفرد غير موجود.', variant: 'destructive' });
            router.push('/dashboard/personnel-list');
        }
      }
    } catch (error) {
        console.error("Failed to load data for editing", error);
        toast({ title: 'خطأ', description: 'فشل تحميل بيانات الفرد.', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  }, [id, form, router]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const storedData = localStorage.getItem('personnelData');
      let personnelList: Personnel[] = storedData ? JSON.parse(storedData) : [];
      
      const updatedList = personnelList.map(p => {
        if (p.id === id) {
          return {
            ...p,
            name: values.fullName,
            cardId: values.cardId,
            rank: values.rank,
            specialization: values.specialization,
            administration: values.administration,
            status: values.status,
            appointmentDate: values.appointmentDate.toISOString(),
            bloodType: values.bloodType,
            maritalStatus: values.maritalStatus,
            notes: values.notes,
          };
        }
        return p;
      });

      localStorage.setItem('personnelData', JSON.stringify(updatedList));

      toast({
        title: 'تم التحديث بنجاح',
        description: `تم تحديث بيانات الفرد ${values.fullName}.`,
      });
      router.push('/dashboard/personnel-list');

    } catch (error) {
       console.error("Failed to save to localStorage", error);
       toast({
        title: 'خطأ في الحفظ',
        description: `تعذر تحديث بيانات الفرد في السجل المحلي.`,
        variant: 'destructive',
      });
    }
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
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="cardId" render={({ field }) => (
                    <FormItem><FormLabel>رقم البطاقة</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="rank" render={({ field }) => (
                        <FormItem><FormLabel>الرتبة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الرتبة" /></SelectTrigger></FormControl><SelectContent>{ranks.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="specialization" render={({ field }) => (
                        <FormItem><FormLabel>التخصص</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر التخصص" /></SelectTrigger></FormControl><SelectContent>{specializations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>الاسم الكامل</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="administration" render={({ field }) => (
                <FormItem><FormLabel>الإدارة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الإدارة" /></SelectTrigger></FormControl><SelectContent>{administrations.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="appointmentDate" render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>تاريخ التعيين</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full justify-between pr-3 pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? (format(field.value, "PPP")) : (<span>اختر تاريخ</span>)}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem><FormLabel>الحالة</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة" /></SelectTrigger></FormControl><SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="bloodType" render={({ field }) => (
                <FormItem><FormLabel>فصيلة الدم</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر فصيلة الدم" /></SelectTrigger></FormControl><SelectContent>{bloodTypes.map(bt => <SelectItem key={bt} value={bt}>{bt}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                <FormItem><FormLabel>الحالة الاجتماعية</FormLabel><Select dir="rtl" onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="اختر الحالة الاجتماعية" /></SelectTrigger></FormControl><SelectContent>{maritalStatuses.map(ms => <SelectItem key={ms} value={ms}>{ms}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="notes" render={({ field }) => (
                <FormItem className="md:col-span-2"><FormLabel>ملاحظات</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="md:col-span-2 flex justify-end space-x-4 rtl:space-x-reverse">
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
