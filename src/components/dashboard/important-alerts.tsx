
'use client';
import { AlertTriangle, Clock, UserCheck, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { getPersonnelById, getAllPersonnel, Personnel } from '@/services/personnel.service';


type Alert = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  style: string;
  iconStyle: string;
};

const generateAlerts = async (): Promise<Alert[]> => {
    let alerts: Alert[] = [];
    const personnelData = await getAllPersonnel();
    
    // Check for incomplete data
    const incompletePersonnel = personnelData.filter((p: any) => !p.cardId || !p.rank || !p.administration);
    if (incompletePersonnel.length > 0) {
        alerts.push({
            id: 'incomplete-data',
            title: 'بيانات غير مكتملة',
            description: `هناك ${new Intl.NumberFormat('ar-EG').format(incompletePersonnel.length)} ضباط ببيانات غير مكتملة تحتاج مراجعة.`,
            icon: AlertTriangle,
            style: 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300',
            iconStyle: 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300',
        });
    }

    // Static alerts
    alerts.push({
        id: 'renewal-dates',
        title: 'مواعيد تجديد',
        description: `هناك ${new Intl.NumberFormat('ar-EG').format(12)} وثيقة تحتاج تجديد خلال الشهر القادم.`,
        icon: Clock,
        style: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
        iconStyle: 'bg-amber-100 dark:bg-amber-800 text-amber-600 dark:text-amber-300',
    });

    alerts.push({
        id: 'performance-review',
        title: 'مراجعة الأداء',
        description: 'حان وقت مراجعة أداء الضباط للربع الحالي.',
        icon: UserCheck,
        style: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        iconStyle: 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300',
    });

    return alerts;
};


export function ImportantAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            const allAlerts = await generateAlerts();
            // In a real app, you'd filter out dismissed alerts from localStorage
            setAlerts(allAlerts.filter(a => !dismissedAlerts.includes(a.id))); 
        }
        fetchAlerts();
    }, [dismissedAlerts]);

    const dismissAlert = (alertId: string) => {
        setDismissedAlerts(prev => [...prev, alertId]);
        // Here you would also update localStorage to persist dismissed alerts
    };

    const formatArabicNumber = (num: number) => {
        return new Intl.NumberFormat('ar-SA').format(num);
    }
    
    if (alerts.length === 0) {
        return null; // Don't render the card if there are no alerts
    }

    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>التنبيهات المهمة</CardTitle>
                <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs font-medium px-2.5 py-0.5 rounded-full">{formatArabicNumber(alerts.length)} تنبيهات</span>
            </CardHeader>
            <CardContent className="space-y-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className={`flex items-center p-4 rounded-lg ${alert.style}`}>
                        <div className={`p-2 rounded-full mr-4 ${alert.iconStyle}`}>
                            <alert.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium">{alert.title}</p>
                            <p className="text-sm">{alert.description}</p>
                        </div>
                        <button onClick={() => dismissAlert(alert.id)} className="opacity-70 hover:opacity-100">
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
