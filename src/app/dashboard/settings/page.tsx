
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
import type { User as UserData } from '@/services/users.service';
import { updateUser } from '@/services/users.service';
import { Skeleton } from '@/components/ui/skeleton';

const themes = [ 'افتراضي', 'أخضر غابي', 'رمادي حجري', 'برتقالي مشمس' ];


export default function SettingsPage() {
    const { theme: mode, setTheme: setMode } = useTheme();
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [notificationPreferences, setNotificationPreferences] = useState({
        email: true,
        push: false,
        newPersonnel: true,
    });
    
    const [activeThemeName, setActiveThemeName] = useState<string>(themes[0]);

    useEffect(() => {
        const savedThemeName = localStorage.getItem('app-theme-name') || themes[0];
        document.documentElement.dataset.theme = savedThemeName;
        setActiveThemeName(savedThemeName);

        const userData = sessionStorage.getItem('user');
        if(userData) {
            const user = JSON.parse(userData);
            setCurrentUser(user);
            setName(user.name);
        }
    }, []);

    const handleSetTheme = (themeName: string) => {
        localStorage.setItem('app-theme-name', themeName);
        
        toast({
            title: 'تم تغيير السمة',
            description: `تم تطبيق سمة "${themeName}" بنجاح.`,
        });
        
        // Reload to apply theme changes from root layout script
        window.location.reload();
    };


    const handleSaveChanges = async () => {
        if (!currentUser || !name.trim()) {
            toast({ title: 'خطأ', description: 'اسم المستخدم لا يمكن أن يكون فارغًا.', variant: 'destructive' });
            return;
        }
        try {
            const updatedUser = await updateUser(currentUser.id, { name: name.trim() });
            sessionStorage.setItem('user', JSON.stringify(updatedUser)); // Update session
            setCurrentUser(updatedUser);
            toast({
                title: 'تم الحفظ',
                description: 'تم حفظ تغييرات الملف الشخصي بنجاح.',
            });
        } catch (error) {
            toast({ title: 'خطأ', description: 'فشل حفظ التغييرات.', variant: 'destructive' });
        }
    };

    const handlePasswordChange = async () => {
        if (!currentUser) return;
        if (newPassword !== confirmPassword) {
            toast({ title: 'خطأ', description: 'كلمتا المرور الجديدتان غير متطابقتين.', variant: 'destructive' });
            return;
        }
        if (!newPassword || !currentPassword) {
            toast({ title: 'خطأ', description: 'الرجاء ملء جميع حقول كلمة المرور.', variant: 'destructive' });
            return;
        }
        try {
            await updateUser(currentUser.id, { password: newPassword });
            toast({
                title: 'تم تغيير كلمة المرور',
                description: 'تم تحديث كلمة المرور الخاصة بك بنجاح.',
            });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
             toast({ title: 'خطأ', description: 'فشل تغيير كلمة المرور. تأكد من كلمة المرور الحالية.', variant: 'destructive' });
        }
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
                            {!currentUser ? <Skeleton className="h-48 w-full" /> : 
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">الاسم</Label>
                                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">الدور</Label>
                                    <Input id="role" value={currentUser.role} disabled />
                                </div>
                                <Button onClick={handleSaveChanges}>حفظ التغييرات</Button>
                                <hr/>
                                 <div className="space-y-4">
                                    <h3 className="text-lg font-medium flex items-center gap-2"><Lock className="h-5 w-5" />تغيير كلمة المرور</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                                        <Input id="current-password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                                        <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                                        <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                    </div>
                                    <Button onClick={handlePasswordChange}>تغيير كلمة المرور</Button>
                                </div>
                            </>
                            }
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
                                <Label className="mb-2 block font-semibold">الوضع</Label>
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
                                    {themes.map((themeName) => (
                                        <div key={themeName} data-theme={themeName}>
                                            <Button
                                                variant={activeThemeName === themeName ? 'secondary' : 'outline'}
                                                className="w-full h-auto flex flex-col items-center justify-center p-2 gap-2"
                                                onClick={() => handleSetTheme(themeName)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full bg-primary"></div>
                                                    <div className="w-5 h-5 rounded-full bg-accent"></div>
                                                </div>
                                                <span className="text-sm text-foreground">{themeName}</span>
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
