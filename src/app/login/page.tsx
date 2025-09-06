
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllUsers } from '@/services/users.service';
import type { User } from '@/services/users.service';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
        try {
            const usersData = await getAllUsers();
            setUsers(usersData);
        } catch (error) {
            toast({
                title: 'خطأ',
                description: 'فشل تحميل قائمة المستخدمين.',
                variant: 'destructive',
            });
        }
    }
    fetchUsers();
  }, [toast]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd verify against the selected user
      if (password === 'password') {
        
        sessionStorage.setItem('isAuthenticated', 'true');

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: `مرحباً بعودتك، ${username || 'مسؤول'}!`,
        });
        router.push('/dashboard/welcome');
      } else {
        toast({
          title: 'خطأ في تسجيل الدخول',
          description: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md shadow-2xl animate-in fade-in duration-700">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit mb-4">
             <Image 
                src="https://i.postimg.cc/JhCP857V/1-removebg-preview.png" 
                alt="شعار هيئة الاستخبارات العسكرية" 
                width={120} 
                height={120} 
                data-ai-hint="military emblem"
                priority
                className="drop-shadow-lg"
              />
          </div>
          <div>
            <CardTitle className="text-3xl">هيئة الاستخبارات العسكرية</CardTitle>
            <CardDescription className="text-2xl mt-1">نظام شئون الضباط</CardDescription>
          </div>
          <CardDescription className="pt-4">الرجاء تسجيل الدخول للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Select dir="rtl" onValueChange={setUsername} value={username} required>
                <SelectTrigger id="username">
                  <SelectValue placeholder="اختر اسم المستخدم" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="ادخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span className="sr-only">{showPassword ? 'إخفاء' : 'إظهار'} كلمة المرور</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !username}>
              {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
