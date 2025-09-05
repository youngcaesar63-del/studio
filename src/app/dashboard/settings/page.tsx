
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, User, Bell, Palette, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

type Theme = {
  name: string;
  primary: { h: number; s: number; l: number };
  accent: { h: number; s: number; l: number };
  background: { h: number; s: number; l: number };
};

const themes: Theme[] = [
    { name: 'افتراضي', primary: { h: 216, s: 83, l: 53 }, accent: { h: 190, s: 80, l: 45 }, background: { h: 220, s: 20, l: 96 } },
    { name: 'أزرق داكن', primary: { h: 221, s: 83, l: 53 }, accent: { h: 217, s: 91, l: 60 }, background: { h: 224, s: 71, l: 4 } },
    { name: 'أخضر غابي', primary: { h: 142, s: 76, l: 36 }, accent: { h: 142, s: 66, l: 46 }, background: { h: 145, s: 15, l: 96 } },
    { name: 'أحمر قرمزي', primary: { h: 346, s: 84, l: 60 }, accent: { h: 346, s: 74, l: 50 }, background: { h: 350, s: 50, l: 96 } },
    { name: 'برتقالي مشمس', primary: { h: 25, s: 95, l: 53 }, accent: { h: 22, s: 90, l: 60 }, background: { h: 30, s: 60, l: 97 } },
];


export default function SettingsPage() {
    const { theme: mode, setTheme: setMode } = useTheme();
    const { toast } = useToast();
    
    const [notificationPreferences, setNotificationPreferences] = useState({
        email: true,
        push: false,
        newPersonnel: true,
    });
    
    const [activeTheme, setActiveTheme] = useState<Theme>(themes[0]);

    useEffect(() => {
        const savedThemeName = localStorage.getItem('app-theme-name') || 'افتراضي';
        const newTheme = themes.find(t => t.name === savedThemeName) || themes[0];
        setTheme(newTheme);
    }, []);

    const setTheme = (theme: Theme) => {
        localStorage.setItem('app-theme-name', theme.name);
        setActiveTheme(theme);
        document.documentElement.style.setProperty('--primary-hsl', `${theme.primary.h} ${theme.primary.s}% ${theme.primary.l}%`);
        document.documentElement.style.setProperty('--primary', `hsl(${theme.primary.h}, ${theme.primary.s}%, ${theme.primary.l}%)`);
        document.documentElement.style.setProperty('--accent', `hsl(${theme.accent.h}, ${theme.accent.s}%, ${theme.accent.l}%)`);
        document.documentElement.style.setProperty('--background', `hsl(${theme.background.h}, ${theme.background.s}%, ${theme.background.l}%)`);
        document.documentElement.style.setProperty('--ring', `hsl(${theme.primary.h}, ${theme.primary.s}%, ${theme.primary.l}%)`);
        toast({
            title: 'تم تغيير السمة',
            description: `تم تطبيق سمة "${theme.name}" بنجاح.`,
        });
    };

    const handleSaveChanges = () => {
        toast({
            title: 'تم الحفظ',
            description: 'تم حفظ تغييرات الملف الشخصي بنجاح.',
        });
    };

    const handlePasswordChange = () => {
        toast({
            title: 'تم تغيير كلمة المرور',
            description: 'تم تحديث كلمة المرور الخاصة بك بنجاح.',
        });
    };

    const handleNotificationPreferences = () => {
        toast({
            title: 'تم الحفظ',
            description: 'تم حفظ تفضيلات الإشعارات بنجاح.',
        });
    };

    const handleNotificationToggle = (id: keyof typeof notificationPreferences) => {
        setNotificationPreferences(prev => ({...prev, [id]: !prev[id]}));
        handleNotificationPreferences();
    }


    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><SettingsIcon className="h-6 w-6"/>الإعدادات</CardTitle>
                    <CardDescription>إدارة إعدادات حسابك وتفضيلات النظام.</CardDescription>
                </CardHeader>
            </Card>

            <Tabs defaultValue="profile" className="w-full" dir="rtl">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile"><User className="ml-2 h-4 w-4" />الملف الشخصي</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="ml-2 h-4 w-4" />الإشعارات</TabsTrigger>
                    <TabsTrigger value="appearance"><Palette className="ml-2 h-4 w-4" />المظهر</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>إعدادات الملف الشخصي</CardTitle>
                            <CardDescription>تحديث بياناتك الشخصية وتغيير كلمة المرور.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">الاسم</Label>
                                <Input id="name" defaultValue="مدير النظام" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">البريد الإلكتروني</Label>
                                <Input id="email" type="email" defaultValue="admin@example.com" disabled />
                            </div>
                            <Button onClick={handleSaveChanges}>حفظ التغييرات</Button>
                            <hr/>
                             <div className="space-y-4">
                                <h3 className="text-lg font-medium flex items-center gap-2"><Lock className="h-5 w-5" />تغيير كلمة المرور</h3>
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                                    <Input id="confirm-password" type="password" />
                                </div>
                                <Button onClick={handlePasswordChange}>تغيير كلمة المرور</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>إعدادات الإشعارات</CardTitle>
                            <CardDescription>اختر كيف تريد أن يتم إعلامك.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label htmlFor="email-notifications" className="font-medium">إشعارات البريد الإلكتروني</Label>
                                    <p className="text-sm text-muted-foreground">تلقي الإشعارات الهامة عبر البريد الإلكتروني.</p>
                                </div>
                                <Switch id="email-notifications" checked={notificationPreferences.email} onCheckedChange={() => handleNotificationToggle('email')} />
                            </div>
                             <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label htmlFor="push-notifications" className="font-medium">إشعارات المتصفح</Label>
                                    <p className="text-sm text-muted-foreground">تلقي إشعارات مباشرة على جهازك.</p>
                                </div>
                                <Switch id="push-notifications" checked={notificationPreferences.push} onCheckedChange={() => handleNotificationToggle('push')} />
                            </div>
                             <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label htmlFor="new-personnel-notification" className="font-medium">عند إضافة ضابط جديد</Label>
                                    <p className="text-sm text-muted-foreground">إشعار عند إضافة ضابط جديد للنظام.</p>
                                </div>
                                <Switch id="new-personnel-notification" checked={notificationPreferences.newPersonnel} onCheckedChange={() => handleNotificationToggle('newPersonnel')} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>المظهر</CardTitle>
                            <CardDescription>تخصيص مظهر واجهة النظام.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label className="mb-2 block font-semibold">الوضع (Theme)</Label>
                                <div className="flex gap-4">
                                     <Button variant={mode === 'light' ? 'secondary' : 'outline'} onClick={() => setMode('light')}>فاتح</Button>
                                     <Button variant={mode === 'dark' ? 'secondary' : 'outline'} onClick={() => setMode('dark')}>داكن</Button>
                                     <Button variant={mode === 'system' ? 'secondary' : 'outline'} onClick={() => setMode('system')}>النظام</Button>
                                </div>
                            </div>
                             <Separator />
                            <div>
                                <Label className="mb-4 block font-semibold">سمات الألوان</Label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {themes.map((theme) => (
                                        <div key={theme.name}>
                                            <Button
                                                variant={activeTheme.name === theme.name ? 'secondary' : 'outline'}
                                                className="w-full h-auto flex flex-col items-center justify-center p-2 gap-2"
                                                onClick={() => setTheme(theme)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${theme.primary.h}, ${theme.primary.s}%, ${theme.primary.l}%)` }}></div>
                                                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${theme.accent.h}, ${theme.accent.s}%, ${theme.accent.l}%)` }}></div>
                                                </div>
                                                <span className="text-sm">{theme.name}</span>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

    
