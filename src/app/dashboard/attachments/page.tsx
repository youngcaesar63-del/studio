
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, Folder as FolderIcon, FileText, MoreVertical, Search, Download, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const files = [
  { name: 'مستندات الهوية', type: 'folder', lastModified: '2024-05-10', size: '2.5 MB' },
  { name: 'شهادات التدريب', type: 'folder', lastModified: '2024-05-12', size: '8.1 MB' },
  { name: 'التقارير الطبية.pdf', type: 'file', lastModified: '2024-05-18', size: '750 KB' },
  { name: 'قرارات النقل.docx', type: 'file', lastModified: '2024-05-20', size: '120 KB' },
  { name: 'نماذج الإجازات', type: 'folder', lastModified: '2024-05-01', size: '1.2 MB' },
  { name: 'صور شخصية.zip', type: 'file', lastModified: '2024-04-22', size: '15.3 MB' },
];

export default function AttachmentsPage() {
    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2"><FolderIcon className="h-6 w-6"/>إدارة المرفقات</CardTitle>
                        <CardDescription>تصفح، حمل، وادارة جميع المرفقات والوثائق المتعلقة بالأفراد.</CardDescription>
                    </div>
                    <Button>
                        <Upload className="ml-2 h-4 w-4" />
                        رفع ملف جديد
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="ابحث عن ملف أو مجلد..." className="pr-10" />
                        </div>
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead className="hidden md:table-cell">تاريخ التعديل</TableHead>
                                    <TableHead className="hidden sm:table-cell">الحجم</TableHead>
                                    <TableHead className="text-left w-24">الإجراءات</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map((file) => (
                                    <TableRow key={file.name} className="hover:bg-muted/30 cursor-pointer">
                                        <TableCell className="font-medium flex items-center gap-2">
                                            {file.type === 'folder' ? <FolderIcon className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5 text-muted-foreground" />}
                                            {file.name}
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-muted-foreground">{file.lastModified}</TableCell>
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">{file.size}</TableCell>
                                        <TableCell className="text-left">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem><Download className="ml-2 h-4 w-4" />تحميل</DropdownMenuItem>
                                                    <DropdownMenuItem><Edit className="ml-2 h-4 w-4" />إعادة تسمية</DropdownMenuItem>
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
                </CardContent>
            </Card>
        </div>
    )
}
