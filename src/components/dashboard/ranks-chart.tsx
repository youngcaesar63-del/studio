'use client';

import { useState } from 'react';
import { Bar, BarChart, Pie, PieChart, ResponsiveContainer, YAxis, XAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { PieChart as PieIcon, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const chartData = [
  { rank: 'ملازم', personnel: 120, fill: 'var(--color-m1)' },
  { rank: 'ملازم أول', personnel: 95, fill: 'var(--color-m2)' },
  { rank: 'نقيب', personnel: 80, fill: 'var(--color-n)' },
  { rank: 'رائد', personnel: 65, fill: 'var(--color-r)' },
  { rank: 'مقدم', personnel: 50, fill: 'var(--color-m3)' },
  { rank: 'عقيد', personnel: 35, fill: 'var(--color-a)' },
  { rank: 'عميد', personnel: 25, fill: 'var(--color-b)' },
  { rank: 'لواء', personnel: 15, fill: 'var(--color-l)' },
];

const chartConfig = {
  personnel: { label: 'الأفراد' },
  m1: { label: 'ملازم', color: '#6366F1' },
  m2: { label: 'ملازم أول', color: '#8B5CF6' },
  n: { label: 'نقيب', color: '#EC4899' },
  r: { label: 'رائد', color: '#F43F5E' },
  m3: { label: 'مقدم', color: '#F97316' },
  a: { label: 'عقيد', color: '#F59E0B' },
  b: { label: 'عميد', color: '#10B981' },
  l: { label: 'لواء', color: '#3B82F6' },
};

export function RanksChart() {
  const [chartType, setChartType] = useState<'doughnut' | 'bar'>('doughnut');

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
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ right: 20 }}>
                 <YAxis dataKey="rank" type="category" tickLine={false} axisLine={false} tickMargin={10} width={60} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                 <XAxis dataKey="personnel" type="number" hide />
                 <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                 <Bar dataKey="personnel" layout="vertical" radius={5} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
