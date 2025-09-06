
'use client';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState, useCallback } from 'react';
import { getAllPersonnel } from '@/services/personnel.service';


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
    try {
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
    } catch(e) {
        console.error("Failed to generate alerts", e);
    }

    return alerts;
};


export function ImportantAlerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    
    const fetchAlerts = useCallback(async () => {
        const allAlerts = await generateAlerts();
        setAlerts(allAlerts); 
    }, []);

    useEffect(() => {
        fetchAlerts();
        
        const handleStorageChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.key === 'personnelData' || customEvent.detail.key === 'all') {
                fetchAlerts();
            }
        };

        window.addEventListener('storage-update', handleStorageChange);

        return () => {
            window.removeEventListener('storage-update', handleStorageChange);
        };
    }, [fetchAlerts]);

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
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
