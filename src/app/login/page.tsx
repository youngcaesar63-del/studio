
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        
        sessionStorage.setItem('isAuthenticated', 'true');

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: 'مرحباً بعودتك!',
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
            <CardDescription className="text-xl mt-1">نظام شئون الضباط</CardDescription>
          </div>
          <CardDescription className="pt-4">الرجاء تسجيل الدخول للمتابعة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">اسم المستخدم</Label>
              <Input
                id="username"
                type="text"
                placeholder="ادخل اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">كلمة المرور</Label>              <Input
                id="password"
                type="password"
                placeholder="ادخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'جاري التحقق...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
