'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Progress } from '@/components/ui/progress';

const MilitaryIntelligenceLogo = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>
      <Image 
        src="https://i.postimg.cc/JhCP857V/1-removebg-preview.png" 
        alt="شعار هيئة الاستخبارات العسكرية" 
        width={100} 
        height={100} 
        data-ai-hint="military emblem"
        priority
        className="drop-shadow-lg"
      />
    </div>
);

const GeneralStaffLogo = (props: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>
      <Image 
        src="https://i.postimg.cc/s2qS0JsR/86bed723-4023-4a33-b9eb-0adca9006dfd-removebg-preview.png" 
        alt="شعار رئاسة هيئة الأركان" 
        width={100} 
        height={100} 
        data-ai-hint="military emblem"
        priority
        className="drop-shadow-lg"
      />
    </div>
);


export default function WelcomePage() {
  const router = useRouter();
  const [date, setDate] = useState({ hijri: '', gregorian: '' });
  const [time, setTime] = useState('');
  const [username] = useState('مدير النظام'); // Hardcoded for now
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const REDIRECT_DELAY = 5000; // 5 seconds
    
    // Timer for redirection
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, REDIRECT_DELAY);

    // Timer for progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => prev + 100 / (REDIRECT_DELAY / 100));
    }, 100);

    // Timer for date and time
    const dateTimeTimer = setInterval(() => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Africa/Khartoum' };
      const hijriDateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Khartoum' };
      const gregorianDateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Khartoum' };

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
      clearInterval(progressTimer);
    };
  }, [router]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-full bg-background text-foreground overflow-hidden p-4">
      {/* Background shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-accent/10 rounded-full filter blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000 w-full max-w-5xl">
        <div className="flex justify-around items-center w-full mb-8 md:mb-16">
          <GeneralStaffLogo className="w-36 h-36" />
          <div className="text-center px-2">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-primary">رئاسة هيئة الأركان</h1>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-wider">هيئة الاستخبارات العسكرية</h2>
          </div>
          <MilitaryIntelligenceLogo className="w-40 h-40" />
        </div>


        <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-6 md:p-8 shadow-lg w-full max-w-3xl mt-4">
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3 mx-auto" />
                    <Skeleton className="h-6 w-2/3 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto" />
                </div>
            ) : (
                <>
                 <div className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-medium mb-4">
                    <User className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    <span>{username}</span>
                </div>
                <div className="flex flex-col gap-3 text-muted-foreground">
                    <div className="flex items-center justify-center gap-2 text-base md:text-lg">
                        <Calendar className="h-5 w-5" />
                        <span>{date.hijri.replace(/،/g, '')}</span>
                    </div>
                     <div className="flex items-center justify-center gap-2 text-xs md:text-sm">
                        <Calendar className="h-4 w-4 opacity-70" />
                        <span>الموافق {date.gregorian}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 text-base md:text-lg">
                        <Clock className="h-5 w-5" />
                        <span suppressHydrationWarning>{time}</span>
                    </div>
                </div>
                </>
            )}
        </div>

        <div className="w-full max-w-lg mt-10 space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground animate-pulse">...جاري توجيهك إلى لوحة التحكم</p>
        </div>
      </div>
    </div>
  );
}
