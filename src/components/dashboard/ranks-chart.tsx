
'use client';

import { useState, useEffect } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, YAxis, XAxis, Cell, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { rankOrder } from '@/lib/constants';


type Personnel = {
  rank: string;
};

const rankColors: { [key: string]: string } = {
  'ملازم': 'hsl(var(--chart-1))',
  'ملازم أول': 'hsl(var(--chart-2))',
  'نقيب': 'hsl(var(--chart-3))',
  'رائد': 'hsl(var(--chart-4))',
  'مقدم': 'hsl(var(--chart-5))',
  'عقيد': '#F59E0B',
  'عميد': '#10B981',
  'لواء': '#3B82F6',
  'فريق': '#6366F1',
  'فريق أول': '#8B5CF6',
};

const chartConfig = {
  personnel: { label: 'الأفراد' },
};

export function RanksChart() {
  const [chartType, setChartType] = useState<'doughnut' | 'bar'>('doughnut');
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
        const storedData = localStorage.getItem('personnelData');
        const personnelList: Personnel[] = storedData ? JSON.parse(storedData) : [];
        
        const rankCounts: { [key: string]: number } = {};
        personnelList.forEach(p => {
            rankCounts[p.rank] = (rankCounts[p.rank] || 0) + 1;
        });

        let data = Object.entries(rankCounts).map(([rank, count]) => ({
            rank,
            personnel: count,
            fill: rankColors[rank] || '#ccc',
        }));
        
        // Sort data based on rank order
        data.sort((a,b) => (rankOrder[a.rank] || 99) - (rankOrder[b.rank] || 99));

        setChartData(data);
    } catch (e) {
        console.error("Failed to load chart data", e);
        setChartData([]);
    } finally {
        setLoading(false);
    }
  }, []);

  if (loading) {
    return <Skeleton className="h-[386px] w-full" />
  }
   
  if (chartData.length === 0) {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>توزيع الأفراد حسب الرتب</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[300px]">
                <p className="text-muted-foreground">لا توجد بيانات لعرضها.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>توزيع الأفراد حسب الرتب</CardTitle>
        <div className="flex gap-2">
          <Button size="icon" variant={chartType === 'doughnut' ? 'secondary' : 'ghost'} onClick={() => setChartType('doughnut')}>
            <PieIcon className="h-4 w-4" />
          </Button>
          <Button size="icon" variant={chartType === 'bar' ? 'secondary' : 'ghost'} onClick={() => setChartType('bar')}>
            <BarChart2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          {chartType === 'doughnut' ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="personnel"
                  nameKey="rank"
                  innerRadius={60}
                  strokeWidth={5}
                  labelLine={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (percent > 0.05) ? (
                      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    ) : null;
                  }}
                >
                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                <CartesianGrid vertical={false} />
                <XAxis 
                  dataKey="rank" 
                  tickLine={false} 
                  axisLine={false}
                  tickMargin={8}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{fill: 'hsl(var(--foreground))', fontSize: 12}}
                 />
                <YAxis tick={{fill: 'hsl(var(--foreground))', fontSize: 12}} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="personnel" radius={8}>
                   {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
