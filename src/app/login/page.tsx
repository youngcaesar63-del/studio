
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the user is already authenticated, redirect to the dashboard
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
      router.replace('/dashboard');
    }
  }, [router]);


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
        router.push('/dashboard');
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
          <div className="mx-auto bg-primary text-primary-foreground p-4 rounded-full w-fit mb-4">
            <Users className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl">نظام شئون ضباط هيئة الاستخبارات العسكرية</CardTitle>
          <CardDescription>الرجاء تسجيل الدخول للمتابعة</CardDescription>
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
