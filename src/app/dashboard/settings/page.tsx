
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings as SettingsIcon, User, Bell, Palette, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();

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
                                <Button variant="secondary" onClick={handlePasswordChange}>تغيير كلمة المرور</Button>
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
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label htmlFor="email-notifications" className="font-medium">إشعارات البريد الإلكتروني</Label>
                                    <p className="text-sm text-muted-foreground">تلقي الإشعارات الهامة عبر البريد الإلكتروني.</p>
                                </div>
                                <Switch id="email-notifications" defaultChecked />
                            </div>
                             <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label htmlFor="push-notifications" className="font-medium">إشعارات المتصفح</Label>
                                    <p className="text-sm text-muted-foreground">تلقي إشعارات مباشرة على جهازك.</p>
                                </div>
                                <Switch id="push-notifications" />
                            </div>
                             <div className="flex items-center justify-between p-4 rounded-lg border">
                                <div>
                                    <Label htmlFor="new-personnel-notification" className="font-medium">إضافة فرد جديد</Label>
                                    <p className="text-sm text-muted-foreground">إشعار عند إضافة فرد جديد للنظام.</p>
                                </div>
                                <Switch id="new-personnel-notification" defaultChecked />
                            </div>
                            <Button onClick={handleNotificationPreferences}>حفظ التفضيلات</Button>
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
                                <Label className="mb-2 block">السمة (Theme)</Label>
                                <div className="flex gap-4">
                                     <Button variant={theme === 'light' ? 'secondary' : 'outline'} onClick={() => setTheme('light')}>فاتح</Button>
                                     <Button variant={theme === 'dark' ? 'secondary' : 'outline'} onClick={() => setTheme('dark')}>داكن</Button>
                                     <Button variant={theme === 'system' ? 'secondary' : 'outline'} onClick={() => setTheme('system')}>النظام</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
