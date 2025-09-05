
'use client';

import { Calendar, Award, User, Plane } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useEffect, useState } from 'react';
import { getLocalStorage } from '@/lib/localStorage-helpers';
import { differenceInDays, format, parseISO } from 'date-fns';
import { arSA } from 'date-fns/locale';

type Personnel = {
  id: number;
  name: string;
  status: string;
  statusDate?: string;
  statusDetail?: string;
};

type UpcomingEvent = {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
};

const generateEvents = (): UpcomingEvent[] => {
    let events: UpcomingEvent[] = [];
    const personnelData: Personnel[] = getLocalStorage('personnelData', []);
    const today = new Date();

    // Check for leave ending soon
    personnelData.forEach(p => {
        if (p.status === 'إجازة' && p.statusDate) {
            const endDate = parseISO(p.statusDate);
            const daysRemaining = differenceInDays(endDate, today);
            if (daysRemaining >= 0 && daysRemaining <= 7) {
                events.push({
                    icon: Plane,
                    iconBg: 'bg-amber-100 dark:bg-amber-900',
                    iconColor: 'text-amber-600 dark:text-amber-300',
                    title: `انتهاء إجازة: ${p.name}`,
                    description: `تنتهي إجازة الضابط قريبًا.`,
                    time: `في ${format(endDate, 'd MMMM', { locale: arSA })}`,
                });
            }
        }
        
        if (p.status === 'دورة تدريبية' && p.statusDetail) {
             events.push({
                icon: Award,
                iconBg: 'bg-blue-100 dark:bg-blue-900',
                iconColor: 'text-blue-600 dark:text-blue-300',
                title: `دورة تدريبية: ${p.name}`,
                description: `يخضع حاليًا لدورة: ${p.statusDetail}`,
                time: 'حاليًا',
            });
        }
    });
    
    // Static event for example
     events.push({ 
        icon: Calendar, 
        iconBg: 'bg-indigo-100 dark:bg-indigo-900', 
        iconColor: 'text-indigo-600 dark:text-indigo-300', 
        title: 'اجتماع الإدارة', 
        description: 'اجتماع دوري لمناقشة سير العمل', 
        time: 'غدًا - ١٠:٠٠ صباحًا' 
    });


    return events.slice(0, 3); // Return max 3 events
};


export function UpcomingEvents() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);

    useEffect(() => {
        setEvents(generateEvents());
    }, []);
    
    if (events.length === 0) {
        return (
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>الأحداث القادمة</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">لا توجد أحداث قادمة مسجلة.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>الأحداث القادمة</CardTitle>
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="#">عرض الكل</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event, index) => (
                        <div key={index} className="bg-muted/30 dark:bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                                <div className={`p-2 rounded-full mr-3 ${event.iconBg}`}>
                                    <event.icon className={`w-4 h-4 ${event.iconColor}`} />
                                </div>
                                <h4 className="font-medium">{event.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{event.description}</p>
                            <p className="text-xs text-muted-foreground/70 mt-2">{event.time}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
