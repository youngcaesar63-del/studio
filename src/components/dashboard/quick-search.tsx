
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { getAllPersonnel } from '@/services/personnel.service';
import { toast } from '@/hooks/use-toast';

type Personnel = {
  id: number;
  name: string;
  cardId: string;
  rank: string;
};

export function QuickSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allPersonnel, setAllPersonnel] = useState<Personnel[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsDataLoading(true);
    try {
        const data = await getAllPersonnel();
        setAllPersonnel(data);
    } catch (error) {
        toast({ title: 'خطأ', description: 'فشل تحميل بيانات البحث.', variant: 'destructive' });
    } finally {
        setIsDataLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();

    const handleStorageChange = (event: Event) => {
        const customEvent = event as CustomEvent;
        if (customEvent.detail.key === 'personnelData' || customEvent.detail.key === 'all') {
            loadData();
        }
    };
    
    window.addEventListener('storage-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage-update', handleStorageChange);
    };
  }, [loadData]);


  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return [];
    }
    return allPersonnel.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.cardId.includes(searchQuery)
    ).slice(0, 7); // Limit to 7 results
  }, [searchQuery, allPersonnel]);

  const handleSelectPersonnel = (person: Personnel) => {
    router.push(`/dashboard/personnel-list/${person.id}`);
    setSearchQuery('');
  };

  if (isDataLoading) {
      return (
          <Card className="shadow-md">
              <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-10 w-full" />
              </CardContent>
          </Card>
      );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>بحث سريع</CardTitle>
        <CardDescription>ابحث عن ضابط بالاسم أو رقم البطاقة للوصول السريع لملفه.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="ابحث..." 
            className="pr-10" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="absolute z-20 w-full bg-card border rounded-md shadow-lg mt-1 max-h-72 overflow-y-auto">
              {searchResults.map(p => (
                <div 
                  key={p.id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectPersonnel(p)}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{p.rank} - {p.cardId}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
