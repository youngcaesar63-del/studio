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
} from "@/components/ui/alert-dialog"

type Personnel = {
  id: number;
  nationalId: string;
  name: string;
  rank: string;
  unit: string;
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

export function PersonnelTable({ data }: { data: Personnel[] }) {
  return (
    <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead className="hidden md:table-cell">الرقم القومي</TableHead>
                <TableHead>الرتبة</TableHead>
                <TableHead className="hidden sm:table-cell">الوحدة</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{person.nationalId}</TableCell>
                  <TableCell>{person.rank}</TableCell>
                  <TableCell className="hidden sm:table-cell">{person.unit}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(person.status)} className="text-xs">{person.status}</Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-start gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
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
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-between items-center mt-6 flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
                عرض ١-٥ من ١٢٤٥
            </div>
            <div className="flex space-x-1 rtl:space-x-reverse">
                <Button variant="outline" size="sm">السابق</Button>
                <Button variant="secondary" size="sm">١</Button>
                <Button variant="outline" size="sm">٢</Button>
                <Button variant="outline" size="sm">٣</Button>
                <span className="px-2">...</span>
                <Button variant="outline" size="sm">١٢٥</Button>
                <Button variant="outline" size="sm">التالي</Button>
            </div>
        </div>
    </div>
  );
}
