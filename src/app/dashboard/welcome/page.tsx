
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const MilitaryIntelligenceLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" {...props}>
        <defs>
            <linearGradient id="gold_grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#d4af37', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#a88807', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="drop_shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
                <feMerge>
                    <feMergeNode in="offsetBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <g filter="url(#drop_shadow)">
            <path d="M100 20 L170 60 L170 140 L100 180 L30 140 L30 60 Z" fill="#003366" stroke="url(#gold_grad)" strokeWidth="4" />
            <circle cx="100" cy="100" r="45" fill="#0c4a8a" stroke="url(#gold_grad)" strokeWidth="3" />
            <path d="M100 55 L125 75 L125 125 L100 145 L75 125 L75 75 Z" fill="#003366" />
            <path d="M85 85 h30 l-15 30 z" fill="#d4af37" />
            <path d="M100,20 L110,60 M100,20 L90,60 M170,60 L130,70 M170,140 L130,130 M100,180 L110,140 M100,180 L90,140 M30,140 L70,130 M30,60 L70,70" fill="none" stroke="url(#gold_grad)" strokeWidth="1.5" opacity="0.6" />
        </g>
    </svg>
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
           <MilitaryIntelligenceLogo className="w-[180px] h-[180px]" />
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
