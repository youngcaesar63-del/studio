
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { logActivity } from '@/lib/activity-log';

type Personnel = {
  id: number;
  cardId: string;
  name: string;
  rank: string;
  specialization?: string;
  batch?: string;
  administration: string;
  status: string;
  statusDetail?: string;
  statusDate?: string;
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case 'بالطابور': return 'default';
        case 'عمليات': return 'destructive';
        case 'إجازة': return 'secondary';
        default: return 'outline';
    }
};

export function PersonnelTable({ data, onDelete }: { data: Personnel[], onDelete: (id: number) => void }) {
  const { toast } = useToast();
  const router = useRouter();

  const confirmDelete = (person: Personnel) => {
    onDelete(person.id);
    logActivity('delete_personnel', `تم حذف الضابط: ${person.name}`, `رقم البطاقة: ${person.cardId}`);
    toast({
      title: 'تم الحذف بنجاح',
      description: `تم حذف بيانات الضابط: ${person.name}`,
      variant: 'destructive'
    });
  }
  
  const formatArabicNumber = (numStr: number | string) => {
    if (numStr === undefined || numStr === null) return '';
    const str = String(numStr);
    return str.replace(/[0-9]/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
  }
  
  const getStatusDisplay = (person: Personnel) => {
      let text = person.status;
      if (person.statusDetail) {
          text = `${person.status} (${person.statusDetail})`;
      } else if (person.statusDate) {
           text = `${person.status} (حتى: ${format(new Date(person.statusDate), 'd MMMM yyyy', { locale: arSA })})`;
      }
      return text;
  }

  return (
    <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 text-center">م</TableHead>
                <TableHead className="text-center border-r">رقم البطاقة</TableHead>
                <TableHead className="text-center border-r">الرتبة</TableHead>
                <TableHead className="text-center border-r">الاسم</TableHead>
                <TableHead className="hidden sm:table-cell text-center border-r">الإدارة</TableHead>
                <TableHead className="text-center border-r">الحالة</TableHead>
                <TableHead className="text-center border-r">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((person, index) => {
                const displayRank = `${person.rank}${person.specialization && person.specialization !== 'لا يوجد' ? ' ' + person.specialization : ''}`;
                return (
                  <TableRow key={person.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-center">{formatArabicNumber(index + 1)}</TableCell>
                    <TableCell className="text-center border-r">{formatArabicNumber(person.cardId)}</TableCell>
                    <TableCell className="text-center border-r">{displayRank}</TableCell>
                    <TableCell className="font-medium text-center border-r">{person.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-center border-r">{person.administration}</TableCell>
                    <TableCell className="text-center border-r">
                      <Badge variant={getStatusVariant(person.status)} className="text-xs">{getStatusDisplay(person)}</Badge>
                    </TableCell>
                    <TableCell className="text-center border-r">
                      <TooltipProvider>
                        <div className="flex items-center justify-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personnel-list/${person.id}`)}><Eye className="h-4 w-4" /></Button>
                              </TooltipTrigger>
                              <TooltipContent><p>عرض</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personnel-list/${person.id}/edit`)}><Edit className="h-4 w-4" /></Button>
                              </TooltipTrigger>
                              <TooltipContent><p>تعديل</p></TooltipContent>
                            </Tooltip>
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent><p>حذف</p></TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    سيتم حذف بيانات الضابط '{person.name}' بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                  <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => confirmDelete(person)}>حذف</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
                عرض {formatArabicNumber(data.length)} من {formatArabicNumber(data.length)} ضابط
            </div>
        </div>
    </div>
  );
}
