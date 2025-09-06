
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { getAllUsers } from '@/services/users.service';
import type { User as UserData } from '@/services/users.service';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd verify against a database
      if (password === 'password' && username) {
        
        sessionStorage.setItem('isAuthenticated', 'true');

        toast({
          title: 'تم تسجيل الدخول بنجاح',
          description: `مرحباً بعودتك، ${username}!`,
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
              <Label htmlFor="username" className="text-right">اسم المستخدم</Label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                 <Input
                  id="username"
                  type="text"
                  placeholder="ادخل اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pr-10"
                />
              </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="password" className="text-right">كلمة المرور</Label>
               <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="ادخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
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
