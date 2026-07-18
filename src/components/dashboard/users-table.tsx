
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

interface UsersTableProps {
    data: User[];
    onDelete: (userId: number) => void;
    onToggleStatus: (userId: number) => void;
    onEdit: (user: User) => void;
}

export function UsersTable({ data, onDelete, onToggleStatus, onEdit }: UsersTableProps) {
  
  return (
    <div className="w-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">الاسم</TableHead>
                <TableHead className="text-center border-r">الدور</TableHead>
                <TableHead className="text-center border-r">آخر تسجيل دخول</TableHead>
                <TableHead className="text-center border-r">الحالة</TableHead>
                <TableHead className="text-center border-r">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-center">{user.name}</TableCell>
                  <TableCell className="text-center border-r">{user.role}</TableCell>
                  <TableCell className="text-muted-foreground text-center border-r">{user.lastLogin}</TableCell>
                  <TableCell className="text-center border-r">
                    <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-center border-r">
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleStatus(user.id)}>
                          {user.status === 'نشط' ? <ToggleLeft className="h-5 w-5 text-green-500" /> : <ToggleRight className="h-5 w-5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(user)}><Edit className="h-4 w-4" /></Button>
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
                                سيتم حذف حساب المستخدم &apos;{user.name}&apos; بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => onDelete(user.id)}>حذف</AlertDialogAction>
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
