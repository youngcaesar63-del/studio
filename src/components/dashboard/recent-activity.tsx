
'use client';

import { useEffect, useState } from 'react';
import { UserPlus, Edit, FileText, Trash2, Award } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { getActivityLog, Activity } from '@/lib/activity-log';
import { formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

const activityIcons = {
  add_personnel: { icon: UserPlus, bg: 'bg-green-100 dark:bg-green-900', color: 'text-green-600 dark:text-green-300' },
  edit_personnel: { icon: Edit, bg: 'bg-blue-100 dark:bg-blue-900', color: 'text-blue-600 dark:text-blue-300' },
  delete_personnel: { icon: Trash2, bg: 'bg-red-100 dark:bg-red-900', color: 'text-red-600 dark:text-red-300' },
  create_report: { icon: FileText, bg: 'bg-amber-100 dark:bg-amber-900', color: 'text-amber-600 dark:text-amber-300' },
  promotion: { icon: Award, bg: 'bg-purple-100 dark:bg-purple-900', color: 'text-purple-600 dark:text-purple-300' },
  default: { icon: Award, bg: 'bg-gray-100 dark:bg-gray-900', color: 'text-gray-600 dark:text-gray-300' },
};

export function RecentActivity() {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            const log = await getActivityLog();
            setActivities(log.slice(0, 5)); // Get latest 5 activities
        };
        fetchActivities();
    }, []);

    const formatTimeAgo = (timestamp: string) => {
        try {
            return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: arSA });
        } catch (error) {
            return 'وقت غير معروف';
        }
    };


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
                    {activities.length > 0 ? (
                        activities.map((activity) => {
                            const { icon: Icon, bg, color } = activityIcons[activity.type] || activityIcons.default;
                            return (
                                <div key={activity.id} className="flex items-start">
                                    <div className={`p-2 rounded-full mr-4 ${bg}`}>
                                        <Icon className={`h-5 w-5 ${color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{activity.title}</p>
                                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        <p className="text-xs text-muted-foreground/70">{formatTimeAgo(activity.timestamp)}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center text-muted-foreground py-10">
                            <p>لا يوجد نشاط مسجل بعد.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
