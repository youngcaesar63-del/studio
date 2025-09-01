
import { UserPlus, FileText, Database, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import Link from 'next/link';

const actions = [
  { href: '/dashboard/add-personnel', label: 'إضافة فرد', icon: UserPlus, iconBg: 'bg-indigo-100 dark:bg-indigo-900', iconColor: 'text-indigo-600 dark:text-indigo-300' },
  { href: '/dashboard/reports', label: 'تقرير شهري', icon: FileText, iconBg: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-300' },
  { href: '/dashboard/backup', label: 'نسخ احتياطي', icon: Database, iconBg: 'bg-green-100 dark:bg-green-900', iconColor: 'text-green-600 dark:text-green-300' },
  { href: '/dashboard/settings', label: 'الإعدادات', icon: Settings, iconBg: 'bg-purple-100 dark:bg-purple-900', iconColor: 'text-purple-600 dark:text-purple-300' },
];

export function QuickActions() {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {actions.map((action) => (
                        <Link key={action.label} href={action.href} className="group">
                            <div className="p-4 rounded-lg flex flex-col items-center justify-center text-center bg-card hover:bg-muted/50 border transition-all duration-300 h-full">
                                <div className={`p-3 rounded-full mb-3 transition-colors duration-300 ${action.iconBg}`}>
                                    <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                                </div>
                                <span className="font-medium text-sm">{action.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
