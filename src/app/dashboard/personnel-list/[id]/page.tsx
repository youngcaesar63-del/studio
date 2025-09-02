
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Shield, Briefcase, Calendar, Info, Hash, ArrowRight, HeartPulse, Heart, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

type Personnel = {
    id: number;
    name: string;
    cardId: string;
    rank: string;
    specialization?: string;
    administration: string;
    status: string;
    appointmentDate?: string;
    lastReturnDate?: string;
    bloodType?: string;
    maritalStatus?: string;
    notes?: string;
    photo?: string;
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'بالطابور': return 'default';
        case 'عمليات': return 'destructive';
        case 'إجازة': return 'secondary';
        default: return 'outline';
    }
};

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: React.ReactNode }) => (
    <div className="flex items-start gap-4">
        <Icon className="h-6 w-6 text-primary mt-1" />
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <div className="font-semibold text-lg">{value || 'غير مسجل'}</div>
        </div>
    </div>
);

export default function ViewPersonnelPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params.id);
    const [person, setPerson] = useState<Personnel | null>(null);
    const [loading, setLoading] = useState(true);

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
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
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
            <Card className="shadow-lg">
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
                <CardContent className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <DetailItem icon={Hash} label="رقم البطاقة" value={person.cardId} />
                        <DetailItem icon={Shield} label="الإدارة" value={person.administration} />
                        <DetailItem icon={Briefcase} label="الحالة" value={<Badge variant={getStatusVariant(person.status)} className="text-md px-3 py-1">{person.status}</Badge>} />
                        <DetailItem 
                            icon={Calendar} 
                            label="تاريخ التعيين" 
                            value={person.appointmentDate ? format(new Date(person.appointmentDate), 'd MMMM yyyy') : 'غير مسجل'} 
                        />
                         <DetailItem 
                            icon={Undo2} 
                            label="تاريخ آخر عودة" 
                            value={person.lastReturnDate ? format(new Date(person.lastReturnDate), 'd MMMM yyyy') : 'غير مسجل'} 
                        />
                        <DetailItem icon={HeartPulse} label="فصيلة الدم" value={person.bloodType} />
                        <DetailItem icon={Heart} label="الحالة الاجتماعية" value={person.maritalStatus} />
                    </div>
                    {person.notes && (
                         <div className="mt-8 pt-6 border-t">
                             <DetailItem icon={Info} label="ملاحظات" value={<p className="text-base font-normal text-muted-foreground whitespace-pre-wrap">{person.notes}</p>} />
                         </div>
                    )}
                    <div className="mt-8 pt-6 border-t flex justify-end">
                        <Button onClick={() => router.back()}>
                           <ArrowRight className="ml-2 h-4 w-4" /> العودة
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
