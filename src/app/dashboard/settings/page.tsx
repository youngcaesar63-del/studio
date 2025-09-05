
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

type ThemeColor = { h: number; s: number; l: number };

type Theme = {
  name: string;
  light: {
    background: ThemeColor;
    foreground: ThemeColor;
    primary: ThemeColor;
    secondary: ThemeColor;
    muted: ThemeColor;
    accent: ThemeColor;
    card: ThemeColor;
    border: ThemeColor;
  };
  dark: {
    background: ThemeColor;
    foreground: ThemeColor;
    primary: ThemeColor;
    secondary: ThemeColor;
    muted: ThemeColor;
    accent: ThemeColor;
    card: ThemeColor;
    border: ThemeColor;
  };
};


const themes: Theme[] = [
    { 
        name: 'افتراضي', 
        light: {
            background: { h: 220, s: 20, l: 96 },
            foreground: { h: 224, s: 71, l: 4 },
            primary: { h: 216, s: 83, l: 53 },
            secondary: { h: 220, s: 15, l: 90 },
            muted: { h: 220, s: 15, l: 90 },
            accent: { h: 190, s: 80, l: 45 },
            card: { h: 0, s: 0, l: 100 },
            border: { h: 220, s: 13, l: 89 },
        },
        dark: {
            background: { h: 224, s: 71, l: 4 },
            foreground: { h: 210, s: 20, l: 98 },
            primary: { h: 216, s: 83, l: 53 },
            secondary: { h: 220, s: 20, l: 20 },
            muted: { h: 220, s: 20, l: 20 },
            accent: { h: 190, s: 80, l: 45 },
            card: { h: 224, s: 71, l: 4 },
            border: { h: 220, s: 20, l: 25 },
        }
    },
    { 
        name: 'أخضر غابي', 
        light: {
            background: { h: 145, s: 15, l: 96 },
            foreground: { h: 140, s: 25, l: 10 },
            primary: { h: 142, s: 76, l: 36 },
            secondary: { h: 145, s: 18, l: 90 },
            muted: { h: 145, s: 18, l: 90 },
            accent: { h: 142, s: 66, l: 46 },
            card: { h: 145, s: 15, l: 100 },
            border: { h: 145, s: 15, l: 89 },
        },
        dark: {
            background: { h: 142, s: 20, l: 10 },
            foreground: { h: 145, s: 15, l: 96 },
            primary: { h: 142, s: 76, l: 36 },
            secondary: { h: 142, s: 15, l: 20 },
            muted: { h: 142, s: 15, l: 20 },
            accent: { h: 142, s: 66, l: 46 },
            card: { h: 142, s: 20, l: 12 },
            border: { h: 142, s: 15, l: 25 },
        }
    },
     { 
        name: 'رمادي حجري', 
        light: {
            background: { h: 210, s: 15, l: 96 },
            foreground: { h: 215, s: 25, l: 10 },
            primary: { h: 215, s: 28, l: 48 },
            secondary: { h: 210, s: 18, l: 90 },
            muted: { h: 210, s: 18, l: 90 },
            accent: { h: 215, s: 20, l: 65 },
            card: { h: 210, s: 15, l: 100 },
            border: { h: 210, s: 15, l: 89 },
        },
        dark: {
            background: { h: 220, s: 13, l: 12 },
            foreground: { h: 210, s: 15, l: 96 },
            primary: { h: 215, s: 28, l: 48 },
            secondary: { h: 220, s: 10, l: 20 },
            muted: { h: 220, s: 10, l: 20 },
            accent: { h: 215, s: 20, l: 65 },
            card: { h: 220, s: 13, l: 15 },
            border: { h: 220, s: 10, l: 25 },
        }
    },
     { 
        name: 'برتقالي مشمس', 
        light: {
            background: { h: 30, s: 60, l: 97 },
            foreground: { h: 25, s: 50, l: 15 },
            primary: { h: 25, s: 95, l: 53 },
            secondary: { h: 30, s: 50, l: 90 },
            muted: { h: 30, s: 50, l: 90 },
            accent: { h: 22, s: 90, l: 60 },
            card: { h: 30, s: 60, l: 100 },
            border: { h: 30, s: 50, l: 89 },
        },
        dark: {
            background: { h: 25, s: 25, l: 10 },
            foreground: { h: 30, s: 60, l: 97 },
            primary: { h: 25, s: 95, l: 53 },
            secondary: { h: 25, s: 20, l: 20 },
            muted: { h: 25, s: 20, l: 20 },
            accent: { h: 22, s: 90, l: 60 },
            card: { h: 25, s: 25, l: 12 },
            border: { h: 25, s: 20, l: 25 },
        }
    },
];

const toHslString = (color: ThemeColor) => `${color.h} ${color.s}% ${color.l}%`;

const applyTheme = (theme: Theme) => {
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return;

    const styleId = 'dynamic-theme-style';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    const lightVars = `
        --background: ${toHslString(theme.light.background)};
        --foreground: ${toHslString(theme.light.foreground)};
        --card: ${toHslString(theme.light.card)};
        --card-foreground: ${toHslString(theme.light.foreground)};
        --popover: ${toHslString(theme.light.card)};
        --popover-foreground: ${toHslString(theme.light.foreground)};
        --primary: ${toHslString(theme.light.primary)};
        --primary-foreground: ${toHslString(theme.dark.foreground)};
        --secondary: ${toHslString(theme.light.secondary)};
        --secondary-foreground: ${toHslString(theme.light.foreground)};
        --muted: ${toHslString(theme.light.muted)};
        --muted-foreground: ${toHslString(theme.light.foreground)} / 0.6;
        --accent: ${toHslString(theme.light.accent)};
        --accent-foreground: ${toHslString(theme.dark.foreground)};
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 100%;
        --border: ${toHslString(theme.light.border)};
        --input: ${toHslString(theme.light.border)};
        --ring: ${toHslString(theme.light.primary)};
    `;
    
    const darkVars = `
        --background: ${toHslString(theme.dark.background)};
        --foreground: ${toHslString(theme.dark.foreground)};
        --card: ${toHslString(theme.dark.card)};
        --card-foreground: ${toHslString(theme.dark.foreground)};
        --popover: ${toHslString(theme.dark.card)};
        --popover-foreground: ${toHslString(theme.dark.foreground)};
        --primary: ${toHslString(theme.dark.primary)};
        --primary-foreground: ${toHslString(theme.dark.foreground)};
        --secondary: ${toHslString(theme.dark.secondary)};
        --secondary-foreground: ${toHslString(theme.dark.foreground)};
        --muted: ${toHslString(theme.dark.muted)};
        --muted-foreground: ${toHslString(theme.dark.foreground)} / 0.6;
        --accent: ${toHslString(theme.dark.accent)};
        --accent-foreground: ${toHslString(theme.light.foreground)};
        --destructive: 0 62.8% 30.6%;
        --destructive-foreground: 0 0% 100%;
        --border: ${toHslString(theme.dark.border)};
        --input: ${toHslString(theme.dark.border)};
        --ring: ${toHslString(theme.dark.primary)};
    `;

    styleTag.innerHTML = `
      :root { ${lightVars} }
      .dark { ${darkVars} }
    `;
};


export default function SettingsPage() {
    const { theme: mode, setTheme: setMode } = useTheme();
    const { toast } = useToast();
    
    const [notificationPreferences, setNotificationPreferences] = useState({
        email: true,
        push: false,
        newPersonnel: true,
    });
    
    const [activeThemeName, setActiveThemeName] = useState<string>(themes[0].name);

    useEffect(() => {
        const savedThemeName = localStorage.getItem('app-theme-name') || themes[0].name;
        const newTheme = themes.find(t => t.name === savedThemeName) || themes[0];
        setActiveThemeName(newTheme.name);
        applyTheme(newTheme);
    }, []);

    const handleSetTheme = (theme: Theme) => {
        localStorage.setItem('app-theme-name', theme.name);
        setActiveThemeName(theme.name);
        applyTheme(theme);
        
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
                                    {themes.map((theme) => (
                                        <div key={theme.name}>
                                            <Button
                                                variant={activeThemeName === theme.name ? 'secondary' : 'outline'}
                                                className="w-full h-auto flex flex-col items-center justify-center p-2 gap-2"
                                                onClick={() => handleSetTheme(theme)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${theme.light.primary.h}, ${theme.light.primary.s}%, ${theme.light.primary.l}%)` }}></div>
                                                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: `hsl(${theme.light.accent.h}, ${theme.light.accent.s}%, ${theme.light.accent.l}%)` }}></div>
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

    