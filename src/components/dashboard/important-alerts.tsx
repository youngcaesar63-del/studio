'use client';
import { AlertTriangle, Clock, UserCheck, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const alerts = [
  {
    title: 'بيانات غير مكتملة',
    description: 'هناك ٥ أفراد ببيانات غير مكتملة تحتاج مراجعة',
    icon: AlertTriangle,
    style: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    iconStyle: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
  },
  {
    title: 'مواعيد تجديد',
    description: 'هناك ١٢ وثيقة تحتاج تجديد خلال الشهر القادم',
    icon: Clock,
    style: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    iconStyle: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300',
  },
  {
    title: 'مراجعة الأداء',
    description: 'حان وقت مراجعة أداء الأفراد للربع الحالي',
    icon: UserCheck,
    style: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    iconStyle: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
  },
];

export function ImportantAlerts() {
    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>التنبيهات المهمة</CardTitle>
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">٣ تنبيهات</span>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.map((alert, index) => (
                    <div key={index} className={`flex items-center p-4 rounded-lg ${alert.style}`}>
                        <div className={`p-2 rounded-full mr-4 ${alert.iconStyle}`}>
                            <alert.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm">{alert.description}</p>
                        </div>
                        <button className="opacity-70 hover:opacity-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
