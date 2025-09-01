
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Database, MoreVertical, Download, RefreshCw, Trash2, PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const backupHistory = [
  { id: 'backup-20240520-0800', date: '2024-05-20 08:00 ص', size: '15.2 MB', status: 'مكتمل' },
  { id: 'backup-20240519-0800', date: '2024-05-19 08:00 ص', size: '15.1 MB', status: 'مكتمل' },
  { id: 'backup-20240518-0800', date: '2024-05-18 08:00 ص', size: '14.9 MB', status: 'مكتمل' },
  { id: 'backup-20240517-0800', date: '2024-05-17 08:00 ص', size: '14.8 MB', status: 'مكتمل' },
  { id: 'backup-20240516-0800', date: '2024-05-16 08:00 ص', size: '14.8 MB', status: 'فشل' },
];

export default function BackupPage() {
    const { toast } = useToast();

    const handleNewBackup = () => {
        toast({
            title: 'بدء عملية النسخ الاحتياطي',
            description: 'جاري إنشاء نسخة احتياطية جديدة للنظام...',
        });
        // Simulate backup process
        setTimeout(() => {
             toast({
                title: 'اكتمل النسخ الاحتياطي',
                description: 'تم إنشاء النسخة الاحتياطية بنجاح.',
                variant: 'default',
             });
        }, 5000);
    };

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2"><Database className="h-6 w-6"/>النسخ الاحتياطي والاستعادة</CardTitle>
                        <CardDescription>إدارة النسخ الاحتياطية لبيانات النظام لضمان سلامتها.</CardDescription>
                    </div>
                    <Button onClick={handleNewBackup}>
                        <PlusCircle className="ml-2 h-4 w-4" />
                        إنشاء نسخة احتياطية جديدة
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>تاريخ النسخة</TableHead>
                                    <TableHead>الحجم</TableHead>
                                    <TableHead>الحالة</TableHead>
                                    <TableHead className="text-left w-24">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {backupHistory.map((backup) => (
                                    <TableRow key={backup.id} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">{backup.date}</TableCell>
                                        <TableCell className="text-muted-foreground">{backup.size}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 text-xs rounded-full ${backup.status === 'مكتمل' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                                {backup.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-left">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><Download className="ml-2 h-4 w-4" />تحميل</DropdownMenuItem>
                                                    <DropdownMenuItem><RefreshCw className="ml-2 h-4 w-4" />استعادة</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive"><Trash2 className="ml-2 h-4 w-4" />حذف</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
                        <div className="text-sm text-muted-foreground">
                            عرض ٥ من ٢٥ نسخة احتياطية
                        </div>
                        <div className="flex space-x-1 rtl:space-x-reverse">
                            <Button variant="outline" size="sm">السابق</Button>
                            <Button variant="secondary" size="sm">١</Button>
                            <Button variant="outline" size="sm">٢</Button>
                            <Button variant="outline" size="sm">٣</Button>
                            <Button variant="outline" size="sm">التالي</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
