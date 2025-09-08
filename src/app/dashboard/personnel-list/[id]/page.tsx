
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Shield, Calendar, Info, Hash, ArrowRight, HeartPulse, Heart, Undo2, ArrowLeftRight, FileCheck, GraduationCap, Users, FileBadge, Phone, MapPin, Building, Globe, Fingerprint, ShieldQuestion, LandPlot, BookOpen, Star, Folder, Home, Award, Languages, Users2, BrainCircuit } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getPersonnelById, Personnel as PersonnelData } from '@/services/personnel.service';


const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'بالطابور': return 'default';
        case 'عمليات': return 'destructive';
        case 'إجازة': return 'secondary';
        default: return 'outline';
    }
};

const DetailItem = ({ icon: Icon, label, value, fullWidth = false }: { icon: React.ElementType, label: string, value: React.ReactNode, fullWidth?: boolean }) => {
    if (!value && typeof value !== 'number') return null;
    return (
        <div className={`flex items-start gap-4 ${fullWidth ? 'md:col-span-2 lg:col-span-3' : ''}`}>
            <Icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <div className="font-semibold text-lg">{value}</div>
            </div>
        </div>
    );
};

export default function ViewPersonnelPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const [person, setPerson] = useState<PersonnelData | null>(null);
    const [loading, setLoading] = useState(true);
    
    const loadData = useCallback(async () => {
        if (!id || isNaN(id)) return;
        setLoading(true);
        try {
            const personToView = await getPersonnelById(id);
            if (personToView) {
                setPerson(personToView);
            } else {
                router.push('/dashboard/personnel-list');
            }
        } catch (error) {
            console.error("Failed to load data for viewing", error);
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const formatArabicNumber = (numStr: number | string | undefined) => {
      if (numStr === undefined || numStr === null) return '';
      const str = String(numStr);
      return str.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    };
    
    const getStatusDisplay = (person: PersonnelData) => {
        const variant = getStatusVariant(person.status);
        let text = person.status;
        if (person.statusDetail) {
            text = `${person.status} (${person.statusDetail})`;
        } else if (person.statusDate) {
             try {
                 text = `${person.status} (حتى: ${format(parseISO(person.statusDate), 'd MMMM yyyy', { locale: arSA })})`;
             } catch(e) {
                // Ignore invalid date
             }
        }
        return <Badge variant={variant} className="text-md px-3 py-1">{text}</Badge>;
    }

    const formatDateSafely = (dateString: string | undefined) => {
        if (!dateString) return 'غير مسجل';
        try {
            return format(parseISO(dateString), 'd MMMM yyyy', { locale: arSA });
        } catch (error) {
            return 'تاريخ غير صالح';
        }
    }


    if (loading) {
        return (
            <Card className="shadow-md">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className='space-y-2'>
                           <Skeleton className="h-8 w-48" />
                           <Skeleton className="h-4 w-32" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                    {[...Array(12)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
                    <div className="md:col-span-2 lg:col-span-3">
                       <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!person) {
        return (
            <Card className="shadow-md text-center p-8">
                <CardTitle>الضابط غير موجود</CardTitle>
                <CardDescription>لم نتمكن من العثور على بيانات الضابط المطلوب.</CardDescription>
                <Button onClick={() => router.push('/dashboard/personnel-list')} className="mt-4">
                    العودة إلى قائمة الضباط
                </Button>
            </Card>
        )
    }
    
    const displayRank = `${person.rank}${person.specialization && person.specialization !== 'لا يوجد' ? ' ' + person.specialization : ''}`;

    return (
        <div className="animate-in fade-in duration-500">
            <Card className="shadow-lg mb-24">
                <CardHeader className="bg-muted/30">
                     <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="p-1 bg-gradient-to-tr from-primary to-accent rounded-full">
                           <div className="bg-card p-2 rounded-full relative w-24 h-24 flex items-center justify-center">
                                {person.photo ? (
                                    <Image src={person.photo} alt={person.name} fill className="rounded-full object-cover" />
                                ) : (
                                    <User className="h-16 w-16 text-primary" />
                                )}
                           </div>
                        </div>
                        <div>
                            <CardTitle className="text-3xl">{person.name}</CardTitle>
                            <CardDescription className="text-md mt-1">{displayRank}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-2">
                  <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
                    
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-bold text-primary">المعلومات الأساسية والوظيفية</AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                <DetailItem icon={Hash} label="رقم البطاقة" value={formatArabicNumber(person.cardId)} />
                                <DetailItem icon={Fingerprint} label="الرقم الوطني" value={person.nationalId ? formatArabicNumber(person.nationalId) : 'غير مسجل'} />
                                <DetailItem icon={Calendar} label="تاريخ الميلاد" value={formatDateSafely(person.dateOfBirth)} />
                                <DetailItem icon={HeartPulse} label="فصيلة الدم" value={person.bloodType} />
                                <DetailItem icon={Heart} label="الحالة الاجتماعية" value={person.maritalStatus} />
                                <DetailItem icon={BookOpen} label="الديانة" value={person.religion} />
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                <DetailItem icon={Shield} label="الإدارة" value={person.administration} />
                                <DetailItem icon={Badge} label="الحالة" value={getStatusDisplay(person)} />
                                <DetailItem icon={GraduationCap} label="المؤهل الأكاديمي" value={person.academicQualification} />
                                {person.major && <DetailItem icon={BrainCircuit} label="التخصص الدقيق" value={person.major} />}
                                <DetailItem icon={Users} label="الدفعة" value={person.batch} />
                                <DetailItem icon={GraduationCap} label="التخصص" value={person.specialization} />
                                <DetailItem icon={Calendar} label="تاريخ التعيين" value={formatDateSafely(person.appointmentDate)} />
                                <DetailItem icon={FileBadge} label="نوع البراءة" value={person.certificateType} />
                                <DetailItem icon={ArrowLeftRight} label="تاريخ النقل" value={formatDateSafely(person.transferDate)} />
                                <DetailItem icon={FileCheck} label="تاريخ التبليغ" value={formatDateSafely(person.reportingDate)} />
                                <DetailItem icon={Undo2} label="تاريخ آخر عودة" value={formatDateSafely(person.lastReturnDate)} />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl font-bold text-primary">المعلومات العائلية والعناوين</AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                 <DetailItem icon={User} label="اسم الأب" value={person.fatherName} />
                                 <DetailItem icon={MapPin} label="عنوان الأب" value={person.fatherAddress} />
                                 <DetailItem icon={User} label="اسم الأم" value={person.motherName} />
                                 <DetailItem icon={User} label="اسم الزوجة" value={person.wifeName} />
                            </div>
                             {person.children && person.children.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-lg font-semibold mb-2 text-muted-foreground">الأبناء</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {person.children.map((child, index) => <li key={index}>{child.name}</li>)}
                                    </ul>
                                </div>
                            )}
                            {person.brothers && person.brothers.length > 0 && (
                                 <div className="mt-6">
                                    <h4 className="text-lg font-semibold mb-2 text-muted-foreground">الأشقاء</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {person.brothers.map((b, index) => <li key={index}>{b.name} {b.address && ` - ${b.address}`}</li>)}
                                    </ul>
                                </div>
                            )}
                             {person.sisters && person.sisters.length > 0 && (
                                 <div className="mt-6">
                                    <h4 className="text-lg font-semibold mb-2 text-muted-foreground">الشقيقات</h4>
                                    <ul className="list-disc list-inside space-y-1">
                                        {person.sisters.map((s, index) => <li key={index}>{s.name} {s.address && ` - ${s.address}`}</li>)}
                                    </ul>
                                </div>
                            )}
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                 <DetailItem icon={Phone} label="رقم سوداني" value={person.phoneNumbers?.sudani ? formatArabicNumber(person.phoneNumbers.sudani) : 'غير مسجل'} />
                                <DetailItem icon={Phone} label="رقم زين" value={person.phoneNumbers?.zain ? formatArabicNumber(person.phoneNumbers.zain) : 'غير مسجل'} />
                                <DetailItem icon={Phone} label="رقم MTN" value={person.phoneNumbers?.mtn ? formatArabicNumber(person.phoneNumbers.mtn) : 'غير مسجل'} />
                                 <DetailItem icon={Globe} label="الولاية" value={person.state} />
                                 <DetailItem icon={Building} label="المدينة" value={person.city} />
                                 <DetailItem icon={MapPin} label="المحلية" value={person.locality} />
                                 <DetailItem icon={Info} label="العنوان بالتفصيل" value={<p className="text-base font-normal text-muted-foreground whitespace-pre-wrap">{person.address}</p>} fullWidth />
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                 <DetailItem icon={ShieldQuestion} label="أقرب الأقربين" value={person.nextOfKinName} />
                                 <DetailItem icon={Phone} label="هاتف القريب" value={person.nextOfKinPhone ? formatArabicNumber(person.nextOfKinPhone) : 'غير مسجل'} />
                                 <DetailItem icon={MapPin} label="عنوان القريب" value={person.nextOfKinAddress} fullWidth />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-xl font-bold text-primary">التاريخ العسكري والمهارات</AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-6">
                           <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><Star className="h-5 w-5" /> أهم الوظائف التي شغلها</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">المسمى الوظيفي</TableHead>
                                                <TableHead className="text-center border-r">من تاريخ</TableHead>
                                                <TableHead className="text-center border-r">إلى تاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.importantJobs && person.importantJobs.length > 0 ? person.importantJobs.map((job, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{job.jobTitle}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(job.periodFrom)}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(job.periodTo)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={3} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><Home className="h-5 w-5" /> الوحدات والإدارات التي عمل بها</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">الوحدة/الإدارة/المعهد</TableHead>
                                                <TableHead className="text-center border-r">الوظيفة</TableHead>
                                                <TableHead className="text-center border-r">من تاريخ</TableHead>
                                                <TableHead className="text-center border-r">إلى تاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.serviceHistory && person.serviceHistory.length > 0 ? person.serviceHistory.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{item.unitName}</TableCell>
                                                    <TableCell className="text-center border-r">{item.jobTitle}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(item.periodFrom)}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(item.periodTo)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={4} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                             <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><LandPlot className="h-5 w-5" /> مناطق خدمة العمليات</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">المنطقة / الوحدة</TableHead>
                                                <TableHead className="text-center border-r">من تاريخ</TableHead>
                                                <TableHead className="text-center border-r">إلى تاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.serviceOperations && person.serviceOperations.length > 0 ? person.serviceOperations.map((op, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{op.areaName}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(op.periodFrom)}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(op.periodTo)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={3} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><LandPlot className="h-5 w-5" /> خلايا وألوية وكتائب عاصفة الحزم</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">الخلية/اللواء/الكتيبة</TableHead>
                                                <TableHead className="text-center border-r">من تاريخ</TableHead>
                                                <TableHead className="text-center border-r">إلى تاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.decisiveStorm && person.decisiveStorm.length > 0 ? person.decisiveStorm.map((op, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{op.name}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(op.periodFrom)}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(op.periodTo)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={3} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                             <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><BookOpen className="h-5 w-5" /> الدورات التدريبية</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">اسم الدورة</TableHead>
                                                <TableHead className="text-center border-r">النوع</TableHead>
                                                <TableHead className="text-center border-r">الحتمية</TableHead>
                                                <TableHead className="text-center border-r">التقدير</TableHead>
                                                <TableHead className="text-center border-r">المعهد</TableHead>
                                                <TableHead className="text-center border-r">من</TableHead>
                                                <TableHead className="text-center border-r">إلى</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.trainingCourses && person.trainingCourses.length > 0 ? person.trainingCourses.map((course, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{course.courseName}</TableCell>
                                                    <TableCell className="text-center border-r">{course.courseType}</TableCell>
                                                    <TableCell className="text-center border-r">{course.imperativeness}</TableCell>
                                                    <TableCell className="text-center border-r">{course.grade || '-'}</TableCell>
                                                    <TableCell className="text-center border-r">{course.institute}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(course.periodFrom)}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(course.periodTo)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={7} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                             <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><Award className="h-5 w-5" /> الأوسمة والأنواط</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">م</TableHead>
                                                <TableHead className="text-center border-r">اسم الوسام / النوط</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.medals && person.medals.length > 0 ? person.medals.map((medal, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center w-16">{formatArabicNumber(index + 1)}</TableCell>
                                                    <TableCell className="text-center border-r">{medal.name}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={2} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                             <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><Languages className="h-5 w-5" /> اللغات واللهجات</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">م</TableHead>
                                                <TableHead className="text-center border-r">اللغة / اللهجة</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.languages && person.languages.length > 0 ? person.languages.map((lang, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center w-16">{formatArabicNumber(index + 1)}</TableCell>
                                                    <TableCell className="text-center border-r">{lang.name}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={2} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                            
                             <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground flex items-center gap-2"><Users2 className="h-5 w-5" /> الآليات</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="text-center">اسم الآلية</TableHead>
                                                <TableHead className="text-center border-r">من تاريخ</TableHead>
                                                <TableHead className="text-center border-r">إلى تاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {person.mechanisms && person.mechanisms.length > 0 ? person.mechanisms.map((v, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="text-center">{v.name}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(v.periodFrom)}</TableCell>
                                                    <TableCell className="text-center border-r">{formatDateSafely(v.periodTo)}</TableCell>
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={3} className="text-center h-24">لا توجد بيانات مسجلة في هذا القسم.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                     <AccordionItem value="item-4">
                        <AccordionTrigger className="text-xl font-bold text-primary">معلومات إضافية</AccordionTrigger>
                        <AccordionContent className="pt-4">
                             {person.notes && (
                                <div>
                                    <DetailItem icon={Info} label="ملاحظات" value={<p className="text-base font-normal text-muted-foreground whitespace-pre-wrap">{person.notes}</p>} fullWidth />
                                </div>
                             )}
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>

                </CardContent>
                <CardFooter className="mt-8 pt-6 border-t flex justify-start items-center">
                    <Button onClick={() => router.push(`/dashboard/attachments?personnelId=${person.id}`)} variant="outline">
                        <Folder className="ml-2 h-4 w-4" />
                        عرض المرفقات
                    </Button>
                </CardFooter>
            </Card>

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            onClick={() => router.back()}
                            className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg z-50"
                            aria-label="العودة"
                        >
                           <ArrowRight className="h-6 w-6" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                        <p>العودة</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

        </div>
    );
}
