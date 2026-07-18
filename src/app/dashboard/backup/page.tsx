
'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, Download, RefreshCw, Trash2, PlusCircle, Loader2, Upload, Cog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { saveAs } from 'file-saver';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { format, subDays, subMonths, subWeeks } from "date-fns";
import { arSA } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    getBackupHistory,
    getBackupDataById,
    createBackup,
    deleteBackup,
    restoreBackupData,
    getAutoBackupSettings,
    saveAutoBackupSettings,
} from '@/services/backup.service';
import type { BackupMeta, AutoBackupSettings } from '@/services/backup.service';

export default function BackupPage() {
    const { toast } = useToast();
    const [backupHistory, setBackupHistory] = useState<BackupMeta[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isRestoring, setIsRestoring] = useState(false);
    const [fileToRestore, setFileToRestore] = useState<File | null>(null);
    const restoreInputRef = useRef<HTMLInputElement>(null);
    const [autoBackupSettings, setAutoBackupSettings] = useState<AutoBackupSettings>({
        enabled: false,
        frequency: 'weekly',
    });

    const formatArabicNumber = (num: number) => {
        return new Intl.NumberFormat('ar-EG').format(num);
    }
    
    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [settings, history] = await Promise.all([getAutoBackupSettings(), getBackupHistory()]);
            setAutoBackupSettings(settings);
            setBackupHistory(history);
        } catch (error) {
            console.error("Failed to load backup data", error);
        }
        setLoading(false);
    }, []);

    const downloadDataFile = useCallback((data: Record<string, any>, dateIso?: string) => {
        const dataString = JSON.stringify(data, null, 2);
        const blob = new Blob([dataString], { type: 'application/json;charset=utf-8' });
        const date = dateIso ? new Date(dateIso) : new Date();
        const timestamp = !isNaN(date.getTime()) ? date.toISOString().replace(/[:.]/g, '-') : 'backup';
        saveAs(blob, `backup-data-${timestamp}.json`);
    }, []);

    const runCreateBackup = useCallback(async (isAuto: boolean = false) => {
        if (!isAuto) {
            setIsCreating(true);
            toast({
                title: 'بدء عملية النسخ الاحتياطي',
                description: 'جاري إنشاء نسخة احتياطية جديدة للنظام.',
            });
        }
        
        try {
            const result = await createBackup();
            if (!result.success || !result.data) {
                throw new Error(result.error || 'create_failed');
            }

            await loadData();

            if (!isAuto) {
                downloadDataFile(result.data, result.meta?.date);
                toast({
                    title: 'اكتمل النسخ الاحتياطي',
                    description: 'تم إنشاء وتنزيل النسخة الاحتياطية بنجاح.',
                });
            } else {
                toast({
                    title: 'نسخ تلقائي مكتمل',
                    description: `تم إنشاء نسخة احتياطية تلقائية بنجاح.`,
                });
            }
        } catch (error) {
            console.error("Backup failed:", error);
            toast({ title: "خطأ", description: "فشل إنشاء النسخة الاحتياطية.", variant: "destructive" });
        } finally {
             if (!isAuto) {
                setIsCreating(false);
             }
        }
    }, [toast, loadData, downloadDataFile]);

    useEffect(() => {
        loadData();
    }, [loadData]);
    
    useEffect(() => {
        if (loading || !autoBackupSettings.enabled) return;

        const lastBackupDate = backupHistory.length > 0 ? new Date(backupHistory[0].date) : null;
        if (!lastBackupDate || isNaN(lastBackupDate.getTime())) {
            runCreateBackup(true);
            return;
        }

        let shouldBackup = false;
        const now = new Date();
        if (autoBackupSettings.frequency === 'daily' && now > subDays(lastBackupDate, -1)) {
            shouldBackup = true;
        } else if (autoBackupSettings.frequency === 'weekly' && now > subWeeks(lastBackupDate, -1)) {
            shouldBackup = true;
        } else if (autoBackupSettings.frequency === 'monthly' && now > subMonths(lastBackupDate, -1)) {
            shouldBackup = true;
        }
        
        if(shouldBackup) {
            runCreateBackup(true);
        }

    }, [loading, autoBackupSettings, backupHistory, runCreateBackup]);


    const handleDownload = async (backupId: string) => {
        try {
            const backupData = await getBackupDataById(backupId);
            if (!backupData) throw new Error("Backup data not found");
            const backupDate = backupHistory.find(b => b.id === backupId)?.date;
            downloadDataFile(backupData, backupDate);
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
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                const restoredData = JSON.parse(text as string);

                const result = await restoreBackupData(restoredData);
                if (!result.success) {
                    throw new Error(result.error);
                }
                
                toast({ title: "تمت الاستعادة بنجاح", description: "تم استعادة بيانات النظام من النسخة الاحتياطية." });
                window.location.reload();
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
    
    const handleDelete = async (backupId: string) => {
        try {
            await deleteBackup(backupId);
            await loadData();
            toast({ title: 'تم الحذف', description: 'تم حذف النسخة الاحتياطية بنجاح.', variant: 'destructive'});
        } catch (error) {
            console.error("Failed to delete backup", error);
            toast({ title: 'خطأ', description: 'فشل حذف النسخة الاحتياطية.', variant: 'destructive'});
        }
    };

    const getStatusVariant = (status: BackupMeta['status']) => {
        switch (status) {
            case 'مكتمل': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'فشل': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-muted text-muted-foreground';
        }
    };
    
    const formatDateSafely = (dateString: string) => {
        if (!dateString) return "تاريخ غير متوفر";
        try {
          const date = new Date(dateString);
          if (isNaN(date.getTime())) {
            return "تاريخ غير صالح";
          }
          return format(date, "d MMMM yyyy, h:mm:ss a", { locale: arSA });
        } catch(e) {
            return "تاريخ غير صالح";
        }
    };

    const handleAutoBackupSettingsChange = async (key: keyof AutoBackupSettings, value: any) => {
        const newSettings = { ...autoBackupSettings, [key]: value };
        setAutoBackupSettings(newSettings);
        try {
            await saveAutoBackupSettings(newSettings);
            toast({ title: 'تم حفظ الإعدادات', description: 'تم تحديث إعدادات النسخ الاحتياطي التلقائي.' });
        } catch (error) {
            console.error("Failed to save settings", error);
            toast({ title: 'خطأ', description: 'فشل حفظ الإعدادات.', variant: 'destructive' });
        }
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
                        
                        <Button onClick={() => runCreateBackup(false)} disabled={isCreating}>
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
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(backup.id)}><Download className="h-4 w-4" /></Button>
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

             <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><Cog className="h-5 w-5"/>إعدادات النسخ الاحتياطي التلقائي</CardTitle>
                    <CardDescription>يقوم النظام بإنشاء نسخة احتياطية تلقائيًا عند تشغيل التطبيق إذا حان وقتها. لن يتم تنزيل الملف، بل سيتم حفظه في السجل أعلاه.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse rounded-lg border p-4">
                        <div className="flex-1">
                            <Label htmlFor="auto-backup-switch" className="font-semibold">تفعيل النسخ الاحتياطي التلقائي</Label>
                            <p className="text-xs text-muted-foreground">عند التفعيل، سيقوم النظام بإنشاء نسخة احتياطية تلقائياً حسب الفاصل الزمني المحدد.</p>
                        </div>
                        <Switch
                            id="auto-backup-switch"
                            checked={autoBackupSettings.enabled}
                            onCheckedChange={(checked) => handleAutoBackupSettingsChange('enabled', checked)}
                        />
                    </div>
                    {autoBackupSettings.enabled && (
                        <div className="space-y-2">
                            <Label htmlFor="frequency-select">الفاصل الزمني</Label>
                             <Select dir="rtl" value={autoBackupSettings.frequency} onValueChange={(value) => handleAutoBackupSettingsChange('frequency', value)}>
                                <SelectTrigger id="frequency-select" className="w-full md:w-1/2">
                                    <SelectValue placeholder="اختر الفاصل الزمني" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">يوميًا</SelectItem>
                                    <SelectItem value="weekly">أسبوعيًا</SelectItem>
                                    <SelectItem value="monthly">شهريًا</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
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
