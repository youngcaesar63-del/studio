
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Shield, Briefcase, Calendar, Info, Hash, ArrowRight, HeartPulse, Heart, Undo2, ArrowLeftRight, FileCheck, GraduationCap, Users, FileBadge, Phone, MapPin, Building, Globe, Fingerprint, ShieldQuestion, LandPlot, BookOpen, Star, Folder, Home, Award, Languages, Users2 } from 'lucide-react';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ImportantJob = {
    jobTitle: string;
    periodFrom: string;
    periodTo: string;
}

type ServiceOperation = {
    areaName: string;
    periodFrom: string;
    periodTo: string;
}

type DecisiveStorm = {
    name: string;
    periodFrom: string;
    periodTo: string;
}

type TrainingCourse = {
    courseName: string;
    courseType: string;
    imperativeness: string;
    institute: string;
    periodFrom: string;
    periodTo: string;
    grade?: string;
}

type ServiceHistory = {
    unitName: string;
    jobTitle: string;
    periodFrom: string;
    periodTo: string;
}

type Medal = {
    name: string;
}

type Language = {
    name: string;
}

type Child = {
    name: string;
}

type Brother = {
    name: string;
    address?: string;
}

type Sister = {
    name: string;
    address?: string;
}

type Mechanism = {
  name: string;
  periodFrom: string;
  periodTo: string;
}

type Personnel = {
    id: number;
    name: string;
    cardId: string;
    rank: string;
    specialization?: string;
    academicQualification?: string;
    batch?: string;
    administration: string;
    status: string;
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
    importantJobs?: ImportantJob[];
    serviceOperations?: ServiceOperation[];
    decisiveStorm?: DecisiveStorm[];
    trainingCourses?: TrainingCourse[];
    serviceHistory?: ServiceHistory[];
    medals?: Medal[];
    languages?: Language[];
    fatherName?: string;
    fatherAddress?: string;
    motherName?: string;
    wifeName?: string;
    children?: Child[];
    brothers?: Brother[];
    sisters?: Sister[];
    mechanisms?: Mechanism[];
};

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
    const [person, setPerson] = useState<Personnel | null>(null);
    const [loading, setLoading] = useState(true);

    const formatArabicNumber = (numStr: number | string) => {
      if (numStr === undefined || numStr === null) return '';
      const str = String(numStr);
      return str.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
    };

    useEffect(() => {
        if (!id) return;
        try {
            const storedData = localStorage.getItem('personnelData');
            if (storedData) {
                const personnelList: Personnel[] = JSON.parse(storedData);
                const personToView = personnelList.find(p => p.id === id);
                if (personToView) {
                    setPerson(personToView);
                } else {
                    router.push('/dashboard/personnel-list');
                }
            }
        } catch (error) {
            console.error("Failed to load data for viewing", error);
        } finally {
            setLoading(false);
        }
    }, [id, router]);

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
                <CardTitle>الفرد غير موجود</CardTitle>
                <CardDescription>لم نتمكن من العثور على بيانات الفرد المطلوب.</CardDescription>
                <Button onClick={() => router.push('/dashboard/personnel-list')} className="mt-4">
                    العودة إلى قائمة الأفراد
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
                                    <Image src={person.photo} alt={person.name} layout="fill" className="rounded-full object-cover" />
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
                <CardContent className="p-6 md:p-8 space-y-8">
                    
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><User className="h-5 w-5" /> المعلومات الشخصية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <DetailItem icon={Hash} label="رقم البطاقة" value={formatArabicNumber(person.cardId)} />
                            <DetailItem icon={Fingerprint} label="الرقم الوطني" value={person.nationalId ? formatArabicNumber(person.nationalId) : 'غير مسجل'} />
                            <DetailItem icon={Calendar} label="تاريخ الميلاد" value={person.dateOfBirth ? format(new Date(person.dateOfBirth), 'd MMMM yyyy', { locale: arSA }) : 'غير مسجل'} />
                            <DetailItem icon={HeartPulse} label="فصيلة الدم" value={person.bloodType} />
                            <DetailItem icon={Heart} label="الحالة الاجتماعية" value={person.maritalStatus} />
                             <DetailItem icon={BookOpen} label="الديانة" value={person.religion} />
                            <DetailItem icon={Phone} label="رقم سوداني" value={person.phoneNumbers?.sudani ? formatArabicNumber(person.phoneNumbers.sudani) : 'غير مسجل'} />
                            <DetailItem icon={Phone} label="رقم زين" value={person.phoneNumbers?.zain ? formatArabicNumber(person.phoneNumbers.zain) : 'غير مسجل'} />
                            <DetailItem icon={Phone} label="رقم MTN" value={person.phoneNumbers?.mtn ? formatArabicNumber(person.phoneNumbers.mtn) : 'غير مسجل'} />
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Briefcase className="h-5 w-5" /> المعلومات الوظيفية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <DetailItem icon={Shield} label="الإدارة" value={person.administration} />
                             <DetailItem icon={Badge} label="الحالة" value={<Badge variant={getStatusVariant(person.status)} className="text-md px-3 py-1">{person.status}</Badge>} />
                            <DetailItem icon={GraduationCap} label="المؤهل الأكاديمي" value={person.academicQualification} />
                            <DetailItem icon={Users} label="الدفعة" value={person.batch} />
                            <DetailItem icon={GraduationCap} label="التخصص" value={person.specialization} />
                            <DetailItem icon={Calendar} label="تاريخ التعيين" value={person.appointmentDate ? format(new Date(person.appointmentDate), 'd MMMM yyyy', { locale: arSA }) : 'غير مسجل'} />
                            <DetailItem icon={FileBadge} label="نوع البراءة" value={person.certificateType} />
                            <DetailItem icon={ArrowLeftRight} label="تاريخ النقل" value={person.transferDate ? format(new Date(person.transferDate), 'd MMMM yyyy', { locale: arSA }) : 'غير مسجل'} />
                            <DetailItem icon={FileCheck} label="تاريخ التبليغ" value={person.reportingDate ? format(new Date(person.reportingDate), 'd MMMM yyyy', { locale: arSA }) : 'غير مسجل'} />
                            <DetailItem icon={Undo2} label="تاريخ آخر عودة" value={person.lastReturnDate ? format(new Date(person.lastReturnDate), 'd MMMM yyyy', { locale: arSA }) : 'غير مسجل'} />
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Users2 className="h-5 w-5" /> المعلومات العائلية</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
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
                    </div>
                    
                    <Separator />
                    
                    {person.importantJobs && person.importantJobs.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Star className="h-5 w-5" /> أهم الوظائف التي شغلها</h3>
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
                                        {person.importantJobs.map((job, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{job.jobTitle}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(job.periodFrom), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(job.periodTo), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    
                    {(person.importantJobs && person.importantJobs.length > 0) && <Separator />}
                    
                    {person.serviceHistory && person.serviceHistory.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Home className="h-5 w-5" /> الوحدات والإدارات والمعاهد التي عمل بها</h3>
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
                                        {person.serviceHistory.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{item.unitName}</TableCell>
                                                <TableCell className="text-center border-r">{item.jobTitle}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(item.periodFrom), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(item.periodTo), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {(person.serviceHistory && person.serviceHistory.length > 0) && ((person.serviceOperations && person.serviceOperations.length > 0) || (person.decisiveStorm && person.decisiveStorm.length > 0)) && <Separator />}


                    {person.serviceOperations && person.serviceOperations.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><LandPlot className="h-5 w-5" /> مناطق خدمة العمليات</h3>
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
                                        {person.serviceOperations.map((op, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{op.areaName}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(op.periodFrom), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(op.periodTo), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    
                    {(person.serviceOperations && person.serviceOperations.length > 0) && (person.decisiveStorm && person.decisiveStorm.length > 0) && <Separator />}
                    
                    {person.decisiveStorm && person.decisiveStorm.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><LandPlot className="h-5 w-5" /> خلايا وألوية وكتائب عاصفة الحزم</h3>
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
                                        {person.decisiveStorm.map((op, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{op.name}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(op.periodFrom), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(op.periodTo), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                     {((person.serviceOperations && person.serviceOperations.length > 0) || (person.decisiveStorm && person.decisiveStorm.length > 0)) && (person.trainingCourses && person.trainingCourses.length > 0) && <Separator />}


                    {person.trainingCourses && person.trainingCourses.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><BookOpen className="h-5 w-5" /> الدورات التدريبية</h3>
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
                                        {person.trainingCourses.map((course, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{course.courseName}</TableCell>
                                                <TableCell className="text-center border-r">{course.courseType}</TableCell>
                                                <TableCell className="text-center border-r">{course.imperativeness}</TableCell>
                                                <TableCell className="text-center border-r">{course.grade || '-'}</TableCell>
                                                <TableCell className="text-center border-r">{course.institute}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(course.periodFrom), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(course.periodTo), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {(person.trainingCourses && person.trainingCourses.length > 0) && (person.medals && person.medals.length > 0) && <Separator />}
                    
                    {person.medals && person.medals.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Award className="h-5 w-5" /> الأوسمة والأنواط</h3>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">م</TableHead>
                                            <TableHead className="text-center border-r">اسم الوسام / النوط</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {person.medals.map((medal, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center w-16">{formatArabicNumber(index + 1)}</TableCell>
                                                <TableCell className="text-center border-r">{medal.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    {(person.medals && person.medals.length > 0) && (person.languages && person.languages.length > 0) && <Separator />}

                    {person.languages && person.languages.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Languages className="h-5 w-5" /> اللغات واللهجات</h3>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">م</TableHead>
                                            <TableHead className="text-center border-r">اللغة / اللهجة</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {person.languages.map((lang, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center w-16">{formatArabicNumber(index + 1)}</TableCell>
                                                <TableCell className="text-center border-r">{lang.name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                    
                     {(person.languages && person.languages.length > 0) && (person.mechanisms && person.mechanisms.length > 0) && <Separator />}

                    {person.mechanisms && person.mechanisms.length > 0 && (
                        <div>
                            <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Users2 className="h-5 w-5" /> الآليات واللجان</h3>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">اسم الآلية / اللجنة</TableHead>
                                            <TableHead className="text-center border-r">من تاريخ</TableHead>
                                            <TableHead className="text-center border-r">إلى تاريخ</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {person.mechanisms.map((v, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">{v.name}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(v.periodFrom), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                                <TableCell className="text-center border-r">{format(new Date(v.periodTo), 'd MMMM yyyy', { locale: arSA })}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}

                    <Separator />
                    
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><MapPin className="h-5 w-5" /> بيانات العنوان</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <DetailItem icon={Globe} label="الولاية" value={person.state} />
                             <DetailItem icon={Building} label="المدينة" value={person.city} />
                             <DetailItem icon={MapPin} label="المحلية" value={person.locality} />
                             <DetailItem icon={Info} label="العنوان بالتفصيل" value={<p className="text-base font-normal text-muted-foreground whitespace-pre-wrap">{person.address}</p>} fullWidth />
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><ShieldQuestion className="h-5 w-5" /> بيانات أقرب الأقربين</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                             <DetailItem icon={User} label="الاسم" value={person.nextOfKinName} />
                             <DetailItem icon={Phone} label="رقم الهاتف" value={person.nextOfKinPhone ? formatArabicNumber(person.nextOfKinPhone) : 'غير مسجل'} />
                             <DetailItem icon={MapPin} label="العنوان" value={person.nextOfKinAddress} fullWidth />
                        </div>
                    </div>

                    {person.notes && (
                         <>
                            <Separator />
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-primary flex items-center gap-2"><Info className="h-5 w-5" /> معلومات إضافية</h3>
                                <div className="grid grid-cols-1">
                                    <DetailItem icon={Info} label="معلومات إضافية" value={<p className="text-base font-normal text-muted-foreground whitespace-pre-wrap">{person.notes}</p>} fullWidth />
                                </div>
                            </div>
                         </>
                    )}
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
                            className="fixed bottom-6 left-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center z-50"
                        >
                           <ArrowRight className="h-6 w-6" />
                           <span className="sr-only">العودة</span>
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
