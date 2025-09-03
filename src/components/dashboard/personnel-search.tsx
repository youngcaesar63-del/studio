
'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { fuzzyPersonnelSearch } from '@/ai/flows/fuzzy-personnel-search';
import { useToast } from '@/hooks/use-toast';

const ranks = ['فريق أول', 'فريق', 'لواء', 'عميد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم أول', 'ملازم'].sort((a,b) => {
    const rankOrder: { [key: string]: number } = { 'فريق أول': 1, 'فريق': 2, 'لواء': 3, 'عميد': 4, 'عقيد': 5, 'مقدم': 6, 'رائد': 7, 'نقيب': 8, 'ملازم أول': 9, 'ملازم': 10 };
    return (rankOrder[a] || 99) - (rankOrder[b] || 99);
});
const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب'].sort((a,b) => a.localeCompare(b, 'ar'));

export function PersonnelSearch() {
  const [query, setQuery] = useState('');
  const [allPersonnel, setAllPersonnel] = useState<string[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('personnelData');
      if (storedData) {
        const personnelList = JSON.parse(storedData);
        setAllPersonnel(personnelList.map((p: any) => p.name));
      }
    } catch (e) {
      console.error("Failed to load personnel names for search", e);
    }
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    try {
      if (allPersonnel.length > 0) {
        const matchedNames = await fuzzyPersonnelSearch({
          partialName: query,
          personnelList: allPersonnel,
        });
        setResults(matchedNames);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Fuzzy search failed:", error);
      toast({
        title: 'خطأ في البحث',
        description: 'حدث خطأ أثناء استخدام البحث الذكي.',
        variant: 'destructive',
      });
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>البحث عن الأفراد</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Input
                type="text"
                placeholder="ابحث بالاسم أو رقم البطاقة..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
            <Select dir="rtl">
              <SelectTrigger>
                <SelectValue placeholder="جميع الرتب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الرتب</SelectItem>
                {ranks.map(rank => <SelectItem key={rank} value={rank}>{rank}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select dir="rtl">
              <SelectTrigger>
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                {statuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'جاري البحث...' : 'بحث'}
            <Search className="mr-2 h-4 w-4" />
          </Button>
        </form>
        {results.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-2">نتائج البحث الذكي بالاسم:</h4>
            <ul className="list-disc pr-6 space-y-1 text-sm text-muted-foreground">
              {results.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
