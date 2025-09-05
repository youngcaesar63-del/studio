
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Download, RefreshCw, Trash2, PlusCircle, Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { getLocalStorage, updateLocalStorage } from "@/lib/localStorage-helpers";
import { saveAs } from 'file-saver';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

type Backup = {
  id: string;
  date: string; // ISO Date string
  size: string;
  status: 'مكتمل' | 'فشل';
  data: any; 
};

const initialBackupHistory: Backup[] = [];

export default function BackupPage() {
    const { toast } = useToast();
    const [backupHistory, setBackupHistory] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [fileToRestore, setFileToRestore] = useState<File | null>(null);
    const restoreInputRef = useRef<HTMLInputElement>(null);

    const formatArabicNumber = (num: number) => {
        return new Intl.NumberFormat('ar-EG').format(num);
    }
    
    const loadData = useCallback(() => {
        setLoading(true);
        let data = getLocalStorage('backupHistory', null);
        if (data === null) {
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
        toast({
            title: 'بدء عملية النسخ الاحتياطي',
            description: 'جاري إنشاء نسخة احتياطية جديدة للنظام.',
        });

        try {
            const allData = {
                personnelData: getLocalStorage('personnelData', []),
                rolesData: getLocalStorage('rolesData', []),
                usersData: getLocalStorage('usersData', []),
                attachmentsData: getLocalStorage('attachmentsData', []),
                'app-theme-name': localStorage.getItem('app-theme-name') || 'افتراضي',
            };

            const dataString = JSON.stringify(allData, null, 2);
            const blob = new Blob([dataString], { type: 'application/json;charset=utf-8' });
            const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2);
            
            const newBackup: Backup = {
                id: `backup-${Date.now()}`,
                date: new Date().toISOString(),
                size: `${sizeInMB} MB`,
                status: 'مكتمل',
                data: allData,
            };

            const currentHistory = getLocalStorage('backupHistory', []);
            const updatedHistory = [newBackup, ...currentHistory];
            updateLocalStorage('backupHistory', updatedHistory);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            saveAs(blob, `backup-data-${timestamp}.json`);
            
            toast({
                title: 'اكتمل النسخ الاحتياطي',
                description: 'تم إنشاء وتنزيل النسخة الاحتياطية بنجاح.',
            });

        } catch (error) {
            console.error("Backup failed:", error);
            toast({ title: "خطأ", description: "فشل إنشاء النسخة الاحتياطية.", variant: "destructive" });
        } finally {
            setIsCreating(false);
        }
    };
    
    const handleDownload = (backup: Backup) => {
         try {
            const dataString = JSON.stringify(backup.data, null, 2);
            const blob = new Blob([dataString], { type: 'application/json;charset=utf-8' });
            const backupDate = new Date(backup.date);
            // Check if the date is valid before using it
            const timestamp = !isNaN(backupDate.getTime()) ? backupDate.toISOString().replace(/[:.]/g, '-') : `invalid-date-${backup.id}`;
            saveAs(blob, `backup-data-${timestamp}.json`);
            toast({ title: 'تم التحميل بنجاح' });
        } catch (error) {
            console.error("Download failed:", error);
            toast({ title: "خطأ", description: "فشل تحميل النسخة الاحتياطية.", variant: "destructive" });
        }
    }
    
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === "application/json") {
             setFileToRestore(file);
        } else {
            toast({ title: "ملف غير صالح", description: "الرجاء اختيار ملف بصيغة JSON.", variant: "destructive"});
            setFileToRestore(null);
        }
    }

    const confirmRestore = () => {
        if (!fileToRestore) return;
        setIsRestoring(true);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                const restoredData = JSON.parse(text as string);

                // Basic validation
                if (!restoredData.personnelData || !restoredData.rolesData) {
                    throw new Error("Invalid backup file structure.");
                }

                // Restore all data
                updateLocalStorage('personnelData', restoredData.personnelData);
                updateLocalStorage('rolesData', restoredData.rolesData);
                updateLocalStorage('usersData', restoredData.usersData);
                updateLocalStorage('attachmentsData', restoredData.attachmentsData || []);
                updateLocalStorage('readNotifications', []);


                if (restoredData['app-theme-name']) {
                    localStorage.setItem('app-theme-name', restoredData['app-theme-name']);
                    // We need to reload to apply theme correctly
                    window.location.reload();
                } else {
                    // Force reload of other pages' data
                    window.dispatchEvent(new CustomEvent('storage-update', { detail: { key: 'all' } }));
                }
                
                toast({ title: "تمت الاستعادة بنجاح", description: "تم استعادة بيانات النظام من النسخة الاحتياطية." });
                

            } catch (error) {
                console.error("Restore failed:", error);
                toast({ title: "خطأ في الاستعادة", description: "الملف تالف أو غير متوافق.", variant: "destructive" });
            } finally {
                setIsRestoring(false);
                setFileToRestore(null);
                if (restoreInputRef.current) {
                    restoreInputRef.current.value = "";
                }
            }
        };
        reader.readAsText(fileToRestore);
    }
    
    const handleDelete = (backupId: string) => {
        const currentHistory = getLocalStorage('backupHistory', []);
        const updatedHistory = currentHistory.filter((b: Backup) => b.id !== backupId);
        updateLocalStorage('backupHistory', updatedHistory);
        toast({ title: 'تم الحذف', description: 'تم حذف النسخة الاحتياطية بنجاح.', variant: 'destructive'});
    };

    const getStatusVariant = (status: Backup['status']) => {
        switch (status) {
            case 'مكتمل': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'فشل': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-muted text-muted-foreground';
        }
    };
    
    const formatDateSafely = (dateString: string) => {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
            return format(date, "d MMMM yyyy, h:mm:ss a", { locale: arSA });
        }
        return "تاريخ غير صالح";
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2"><Database className="h-6 w-6"/>النسخ الاحتياطي والاستعادة</CardTitle>
                        <CardDescription>إدارة النسخ الاحتياطية لبيانات النظام لضمان سلامتها واستعادتها عند الحاجة.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={() => restoreInputRef.current?.click()} variant="outline" disabled={isRestoring}>
                             {isRestoring ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Upload className="ml-2 h-4 w-4" />}
                            {isRestoring ? 'جاري الاستعادة...' : 'استعادة نسخة احتياطية'}
                        </Button>
                        <input type="file" ref={restoreInputRef} onChange={handleFileSelect} accept=".json" className="hidden" />
                        
                        <Button onClick={handleNewBackup} disabled={isCreating}>
                            {isCreating ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <PlusCircle className="ml-2 h-4 w-4" />}
                            {isCreating ? 'جاري الإنشاء...' : 'إنشاء نسخة احتياطية'}
                        </Button>
                    </div>
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
                                {backupHistory.length > 0 ? backupHistory.map((backup) => (
                                    <TableRow key={backup.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium text-center">{formatDateSafely(backup.date)}</TableCell>
                                        <TableCell className="text-muted-foreground text-center border-r">{backup.size}</TableCell>
                                        <TableCell className="text-center border-r">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusVariant(backup.status)}`}>
                                                {backup.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center border-r">
                                             <div className="flex justify-center items-center gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(backup)}><Download className="h-4 w-4" /></Button>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                        سيتم حذف النسخة الاحتياطية بتاريخ {formatDateSafely(backup.date)} بشكل دائم.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleDelete(backup.id)}>حذف</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            لا يوجد سجل للنسخ الاحتياطية.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                   )}
                     <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                        <div className="text-sm text-muted-foreground">
                            عرض {formatArabicNumber(backupHistory.length)} من {formatArabicNumber(backupHistory.length)} نسخة احتياطية.
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!fileToRestore} onOpenChange={(open) => !open && setFileToRestore(null)}>
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>تأكيد استعادة البيانات</AlertDialogTitle>
                    <AlertDialogDescription>
                        هل أنت متأكد من رغبتك في استعادة البيانات من الملف: <span className="font-bold">{fileToRestore?.name}</span>؟
                        <br/>
                        <strong className="text-destructive mt-2 block">سيتم استبدال جميع البيانات الحالية (الضباط، المستخدمين، الإعدادات، إلخ) بالبيانات الموجودة في ملف النسخة الاحتياطية. لا يمكن التراجع عن هذا الإجراء.</strong>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setFileToRestore(null)}>إلغاء</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmRestore} disabled={isRestoring}>
                        {isRestoring ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <RefreshCw className="ml-2 h-4 w-4" />}
                        {isRestoring ? 'جاري الاستعادة...' : 'تأكيد واستعادة'}
                    </AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}
