
'use client';

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Database, MoreVertical, Download, RefreshCw, Trash2, PlusCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage-helpers";

type Backup = {
  id: string;
  date: string;
  size: string;
  status: 'مكتمل' | 'فشل' | 'جاري الإنشاء...';
};

const initialBackupHistory: Backup[] = [
  { id: `backup-${Date.now() - 86400000}`, date: new Date(Date.now() - 86400000).toLocaleString('ar-SA'), size: '15.2 MB', status: 'مكتمل' },
  { id: `backup-${Date.now() - 172800000}`, date: new Date(Date.now() - 172800000).toLocaleString('ar-SA'), size: '15.1 MB', status: 'مكتمل' },
  { id: `backup-${Date.now() - 259200000}`, date: new Date(Date.now() - 259200000).toLocaleString('ar-SA'), size: '14.9 MB', status: 'مكتمل' },
  { id: `backup-${Date.now() - 345600000}`, date: new Date(Date.now() - 345600000).toLocaleString('ar-SA'), size: '14.8 MB', status: 'فشل' },
];

export default function BackupPage() {
    const { toast } = useToast();
    const [backupHistory, setBackupHistory] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const formatArabicNumber = (num: number) => {
      return new Intl.NumberFormat('ar-SA', { useGrouping: false }).format(num);
    }
    
    const loadData = useCallback(() => {
        setLoading(true);
        let data = getLocalStorage('backupHistory', null);
        if (data === null || data.length === 0) {
            data = initialBackupHistory;
            updateLocalStorage('backupHistory', initialBackupHistory);
        }
        setBackupHistory(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
        
        const handleStorageChange = (event: Event) => {
            const customEvent = event as CustomEvent;
            if (customEvent.detail.key === 'backupHistory') {
                loadData();
            }
        };

        window.addEventListener('storage-update', handleStorageChange);

        return () => {
            window.removeEventListener('storage-update', handleStorageChange);
        };
    }, [loadData]);

    const handleNewBackup = () => {
        setIsCreating(true);
        const newBackupId = `backup-${Date.now()}`;
        const newBackup: Backup = {
            id: newBackupId,
            date: new Date().toLocaleString('ar-SA'),
            size: '...',
            status: 'جاري الإنشاء...',
        };

        const currentHistory = getLocalStorage('backupHistory', []);
        const updatedHistory = [newBackup, ...currentHistory];
        updateLocalStorage('backupHistory', updatedHistory);
        
        toast({
            title: 'بدء عملية النسخ الاحتياطي',
            description: 'جاري إنشاء نسخة احتياطية جديدة للنظام.',
        });

        setTimeout(() => {
            const finalHistory = getLocalStorage('backupHistory', []).map((b : Backup) => {
                if (b.id === newBackupId) {
                    return { ...b, status: 'مكتمل', size: `${(15 + Math.random() * 2).toFixed(1)} MB` };
                }
                return b;
            });
            updateLocalStorage('backupHistory', finalHistory);
            setIsCreating(false);
            toast({
                title: 'اكتمل النسخ الاحتياطي',
                description: 'تم إنشاء النسخة الاحتياطية بنجاح.',
            });
        }, 3000);
    };

    const handleAction = (message: string) => {
      toast({
        title: 'تم بنجاح',
        description: message,
      });
    };
    
    const handleDelete = (backupId: string) => {
        const currentHistory = getLocalStorage('backupHistory', []);
        const updatedHistory = currentHistory.filter((b: Backup) => b.id !== backupId);
        updateLocalStorage('backupHistory', updatedHistory);
        handleAction(`تم حذف النسخة الاحتياطية بنجاح.`);
    };

    const getStatusVariant = (status: Backup['status']) => {
        switch (status) {
            case 'مكتمل': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'فشل': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'جاري الإنشاء...': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2"><Database className="h-6 w-6"/>النسخ الاحتياطي والاستعادة</CardTitle>
                        <CardDescription>إدارة النسخ الاحتياطية لبيانات النظام لضمان سلامتها.</CardDescription>
                    </div>
                    <Button onClick={handleNewBackup} disabled={isCreating}>
                        {isCreating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <PlusCircle className="ml-2 h-4 w-4" />}
                        {isCreating ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
                    </Button>
                </CardHeader>
                <CardContent>
                   {loading ? (
                       <div className="space-y-4">
                           <Skeleton className="h-12 w-full" />
                           <Skeleton className="h-10 w-full" />
                           <Skeleton className="h-10 w-full" />
                       </div>
                   ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">تاريخ النسخة</TableHead>
                                    <TableHead className="text-center border-r">الحجم</TableHead>
                                    <TableHead className="text-center border-r">الحالة</TableHead>
                                    <TableHead className="text-center border-r w-24">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backupHistory.map((backup) => (
                                    <TableRow key={backup.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium text-center">{backup.date}</TableCell>
                                        <TableCell className="text-muted-foreground text-center border-r">{backup.size}</TableCell>
                                        <TableCell className="text-center border-r">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusVariant(backup.status)}`}>
                                                {backup.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center border-r">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={backup.status === 'جاري الإنشاء...'}>
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onSelect={() => handleAction(`جاري تحميل النسخة الاحتياطية: ${backup.id}`)}><Download className="ml-2 h-4 w-4" />تحميل</DropdownMenuItem>
                                                    <DropdownMenuItem onSelect={() => handleAction(`جاري استعادة النسخة الاحتياطية: ${backup.id}`)}><RefreshCw className="ml-2 h-4 w-4" />استعادة</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => handleDelete(backup.id)}><Trash2 className="ml-2 h-4 w-4" />حذف</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                   )}
                     <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                        <div className="text-sm text-muted-foreground">
                            عرض {formatArabicNumber(backupHistory.length)} من {formatArabicNumber(backupHistory.length)} نسخة احتياطية
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
