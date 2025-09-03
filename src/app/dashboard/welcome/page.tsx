
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, User } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const MilitaryIntelligenceLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" {...props}>
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgb(255,215,0)', stopOpacity:1}} />
            <stop offset="100%" style={{stopColor: 'rgb(218,165,32)', stopOpacity:1}} />
            </linearGradient>
            <style>
                {`@import url('https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@700&display=swap');`}
            </style>
        </defs>
        <g transform="translate(0, -20)">
            <g transform="translate(200, 150)">
                <path d="M0 -110 L-150 -40 A160 160 0 0 0 -150 100 L0 170 L150 100 A160 160 0 0 0 150 -40 Z" fill="#166534"/>
                <path d="M0 -100 L-140 -35 A150 150 0 0 0 -140 95 L0 160 L140 95 A150 150 0 0 0 140 -35 Z" fill="#15803d" stroke="#f0fdf4" strokeWidth="2"/>
                
                {/* Fronds */}
                <g stroke="#14532d" strokeWidth="1.5">
                    {[...Array(7)].map((_, i) => (
                        <g key={`frond-left-${i}`}>
                            <path d={`M-30 ${-90 + i*25} Q -80 ${-80 + i*25} -135 ${-30 + i*24}`} fill="none" strokeDasharray="3 3" opacity="0.5"/>
                        </g>
                    ))}
                    {[...Array(7)].map((_, i) => (
                        <g key={`frond-right-${i}`}>
                           <path d={`M30 ${-90 + i*25} Q 80 ${-80 + i*25} 135 ${-30 + i*24}`} fill="none" strokeDasharray="3 3" opacity="0.5"/>
                        </g>
                    ))}
                </g>
            </g>
            
            {/* Hoopoe Bird */}
            <g transform="translate(200, 200)">
                <path d="M-5 -15 C -20 -25, -30 -10, -25 5 C -20 20, 0 25, 10 20 C 20 15, 25 0, 15 -10 C 10 -20, 5 -20, -5 -15 Z" fill="#4a4a4a"/>
                <path d="M-5 -15 C 0 -22, 10 -22, 15 -10 L18 -5 C 25 0, 20 15, 10 20 L5 22 C -5 23, -15 15, -20 5 L -25 0 C-30 -10, -20 -25, -5 -15" fill="#5e5e5e"/>
                <path d="M-25,2 C-27, -5, -20, -15, -10, -13" fill="none" stroke="#333" strokeWidth="2"/>
                <path d="M-28, -8 a 5 3 0 0 1 10 0 a 5 3 0 0 1 -10 0" fill="#333"/>
                <path d="M15 -10 C 25 -20, 35 -15, 30 -5 C 25 5, 18 -5, 15 -10" fill="#a3a3a3"/>
                <path d="M30 -5 L45 -8 L32 -3 Z" fill="white"/>
                <circle cx="-18" cy="-5" r="1.5" fill="white"/>
            </g>

            {/* Sword and Key */}
            <g transform="translate(240, 90) rotate(20)">
                <rect x="-35" y="-4" width="70" height="8" fill="#facc15" rx="2"/>
                <rect x="28" y="-7" width="12" height="14" fill="#facc15"/>
                <circle cx="34" cy="0" r="4" fill="#d97706"/>
                <g transform="rotate(90) translate(0, 0)">
                    <path d="M0 -40 L5 0 L-5 0 Z" fill="#ef4444"/>
                    <path d="M-10 0 L10 0 L10 5 L-10 5 Z" fill="#b91c1c"/>
                </g>
            </g>
            
            {/* Banner */}
            <g transform="translate(200, 280)">
                <path d="M-160 0 C -100 20, 100 20, 160 0 L 170 30 C 100 10, -100 10, -170 30 Z" fill="#16a34a"/>
                <path d="M-160,2 L-180,20 L-150,15 Z" fill="#dc2626"/>
                <path d="M160,2 L180,20 L150,15 Z" fill="#dc2626"/>
                <text x="0" y="22" fontFamily="'Scheherazade New', serif" fontSize="28" fill="white" textAnchor="middle" fontWeight="bold">هيئة الاستخبارات العسكرية</text>
                 <text x="0" y="50" fontFamily="'Scheherazade New', serif" fontSize="18" fill="#f0fdf4" textAnchor="middle" fontWeight="bold">قوة .. صدق .. إخلاص</text>
            </g>
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
