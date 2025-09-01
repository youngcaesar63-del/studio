
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ToggleRight, ToggleLeft } from 'lucide-react';
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

type User = {
  id: number;
  name: string;
  role: string;
  lastLogin: string;
  status: 'نشط' | 'غير نشط';
};

const getStatusVariant = (status: string): "default" | "secondary" => {
    return status === 'نشط' ? 'default' : 'secondary';
};

export function UsersTable({ data }: { data: User[] }) {
  const { toast } = useToast();

  const handleAction = (message: string) => {
    toast({
      title: 'تم بنجاح',
      description: message,
    });
  };

  return (
    <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>آخر تسجيل دخول</TableHead>
                <TableHead>الحالة</TableHead>
                <TableHead className="text-left">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex items-center justify-start gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700" onClick={() => handleAction(`تم تغيير حالة المستخدم: ${user.name}`)}>
                          {user.status === 'نشط' ? <ToggleLeft className="h-5 w-5" /> : <ToggleRight className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAction(`جاري تعديل بيانات المستخدم: ${user.name}`)}><Edit className="h-4 w-4" /></Button>
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
                                سيتم حذف حساب المستخدم '{user.name}' بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => handleAction(`تم حذف المستخدم: ${user.name}`)}>حذف</AlertDialogAction>
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
    </div>
  );
}
