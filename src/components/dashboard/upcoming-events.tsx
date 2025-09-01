import { Calendar, Award, Clipboard } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const events = [
    { icon: Calendar, iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300', title: 'اجتماع الإدارة', description: 'اجتماع دوري لمناقشة سير العمل', time: 'غدًا - ١٠:٠٠ صباحًا' },
    { icon: Award, iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-300', title: 'حفل ترفيع', description: 'حفل ترفيع عدد من الأفراد', time: 'بعد غد - ١١:٠٠ صباحًا' },
    { icon: Clipboard, iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300', title: 'انتهاء التقييمات', description: 'آخر موعد لتسليم تقييمات الأداء', time: 'الأسبوع القادم' },
];

export function UpcomingEvents() {
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
