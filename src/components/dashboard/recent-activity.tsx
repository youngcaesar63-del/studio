
import { UserPlus, Edit, FileText, Award } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

const activities = [
  { icon: UserPlus, iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-300', title: 'تمت إضافة فرد جديد', description: 'رقم البطاقة: ٢٩٨٠٤١٥٠٢٠١٢٣٤ - الاسم: أحمد محمد علي', time: 'منذ ٣٠ دقيقة' },
  { icon: Edit, iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300', title: 'تم تعديل بيانات فرد', description: 'رقم البطاقة: ٢٩٨٠٤١٥٠٢٠١٢٣٤ - التعديل: تغيير الرتبة', time: 'منذ ساعتين' },
  { icon: FileText, iconBg: 'bg-amber-100 dark:bg-amber-900', iconColor: 'text-amber-600 dark:text-amber-300', title: 'تم إنشاء تقرير', description: 'تقرير الأفراد حسب الإدارات للربع الأول', time: 'منذ ٥ ساعات' },
  { icon: Award, iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300', title: 'ترقية فرد', description: 'رقم البطاقة: ٢٩٨٠٤١٥٠٢٠١٢٣٤ - الرتبة الجديدة: نقيب', time: 'منذ ٨ ساعات' },
];

export function RecentActivity() {
    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>النشاط الأخير</CardTitle>
                <Button asChild variant="link" className="p-0 h-auto">
                    <Link href="#">عرض الكل</Link>
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start">
                            <div className={`p-2 rounded-full mr-4 ${activity.iconBg}`}>
                                <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-sm">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                <p className="text-xs text-muted-foreground/70">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
