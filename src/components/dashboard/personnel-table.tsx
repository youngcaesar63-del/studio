
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

type Personnel = {
  id: number;
  cardId: string;
  name: string;
  rank: string;
  specialization?: string;
  batch?: string;
  administration: string;
  status: string;
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
    toast({
      title: 'تم بنجاح',
      description: `تم حذف الفرد: ${person.name}`,
    });
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
                  <TableRow key={person.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="border-r">{person.cardId}</TableCell>
                    <TableCell className="border-r">{displayRank}</TableCell>
                    <TableCell className="font-medium border-r">{person.name}</TableCell>
                    <TableCell className="hidden sm:table-cell border-r">{person.administration}</TableCell>
                    <TableCell className="border-r">
                      <Badge variant={getStatusVariant(person.status)} className="text-xs">{person.status}</Badge>
                    </TableCell>
                    <TableCell className="text-left border-r">
                      <div className="flex items-center justify-start gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personnel-list/${person.id}`)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personnel-list/${person.id}/edit`)}><Edit className="h-4 w-4" /></Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                  سيتم حذف بيانات الفرد '{person.name}' بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                                <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => confirmDelete(person)}>حذف</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
                عرض {data.length} من {data.length}
            </div>
            {/* Pagination can be re-enabled later if needed */}
            {/* <div className="flex space-x-1 rtl:space-x-reverse">
                <Button variant="outline" size="sm">السابق</Button>
                <Button variant="secondary" size="sm">١</Button>
                <Button variant="outline" size="sm">التالي</Button>
            </div> */}
        </div>
    </div>
  );
}
