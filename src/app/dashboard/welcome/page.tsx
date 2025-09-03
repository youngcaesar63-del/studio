
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const MilitaryIntelligenceLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <div {...props}>
      <Image 
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAaQAAAGkAQMAAABI2yv7AAAABlBMVEUAAAAAAAACbpS9AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAADFJREFUaN7twQENAAAAwiD7p7+IPgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8A2O3AABllCQ3AAAAABJRU5ErkJggg==" 
        alt="شعار هيئة الاستخبارات العسكرية" 
        width={420} 
        height={420} 
        data-ai-hint="military emblem"
      />
    </div>
);


export default function WelcomePage() {
  const router = useRouter();
  const [date, setDate] = useState({ hijri: '', gregorian: '' });
  const [time, setTime] = useState('');
  const [username] = useState('مدير النظام'); // Hardcoded for now
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 5000); // Redirect after 5 seconds

    const dateTimeTimer = setInterval(() => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Riyadh' };
      const hijriDateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Riyadh' };
      const gregorianDateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Riyadh' };

      setTime(new Intl.DateTimeFormat('ar-SA-u-nu-latn', timeOptions).format(now));
      setDate({
        hijri: new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', hijriDateOptions).format(now),
        gregorian: new Intl.DateTimeFormat('ar-SA-u-nu-latn', gregorianDateOptions).format(now),
      });
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(dateTimeTimer);
    };
  }, [router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background text-foreground overflow-hidden p-4">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="mb-6">
           <MilitaryIntelligenceLogo className="w-[250px] h-[250px]" />
        </div>

        <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-primary">رئاسة هيئة الأركان</h1>
            <h2 className="text-4xl font-extrabold tracking-wider">هيئة الاستخبارات العسكرية</h2>
        </div>

        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg w-full max-w-lg">
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-6 w-1/3 mx-auto" />
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                    <Skeleton className="h-5 w-1/2 mx-auto" />
                </div>
            ) : (
                <>
                 <div className="flex items-center justify-center gap-3 text-2xl font-medium mb-4">
                    <User className="h-7 w-7 text-primary" />
                    <span>{username}</span>
                </div>
                <div className="flex flex-col gap-2 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{date.hijri}</span>
                    </div>
                     <div className="flex items-center justify-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 opacity-70" />
                        <span>الموافق {date.gregorian}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                        <Clock className="h-5 w-5" />
                        <span>{time}</span>
                    </div>
                </div>
                </>
            )}
        </div>

        <p className="mt-8 text-muted-foreground animate-pulse">...جاري توجيهك إلى لوحة التحكم</p>
      </div>
    </div>
  );
}
