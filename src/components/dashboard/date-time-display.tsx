
'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

export function DateTimeDisplay() {
  const [time, setTime] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Africa/Khartoum' };
      const timeString = new Intl.DateTimeFormat('ar-SA-u-nu-arab', timeOptions).format(now);
      setTime(timeString);

      const hijriDateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Khartoum' };
      const hijriDateString = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura-nu-arab', hijriDateOptions).format(now);
      setHijriDate(hijriDateString);
      
      const gregorianDateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Africa/Khartoum' };
      const gregorianDateString = new Intl.DateTimeFormat('ar-SA-u-nu-latn', gregorianDateOptions).format(now);
      setGregorianDate(gregorianDateString);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);


  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse flex-wrap gap-2">
        <div className="flex items-center bg-card dark:bg-card/50 px-4 py-2 rounded-lg shadow-sm transition-colors duration-300">
            <Calendar className="ml-2 h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">{hijriDate || '...'}</span>
        </div>
         <div className="flex items-center bg-card dark:bg-card/50 px-4 py-2 rounded-lg shadow-sm transition-colors duration-300">
            <Calendar className="ml-2 h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm">{gregorianDate || '...'}</span>
        </div>
        <div className="flex items-center bg-card dark:bg-card/50 px-4 py-2 rounded-lg shadow-sm transition-colors duration-300">
            <Clock className="ml-2 h-5 w-5 text-muted-foreground" />
            <span className="font-medium text-sm" suppressHydrationWarning>{time || '...'}</span>
        </div>
    </div>
  );
}
