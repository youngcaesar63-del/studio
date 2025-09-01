
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart2, Users, Calendar, TrendingUp, TrendingDown, MapPin } from "lucide-react"
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const statusData = [
    { name: 'بالطابور', value: 985, fill: 'var(--chart-1)' },
    { name: 'عمليات', value: 65, fill: 'var(--chart-2)' },
    { name: 'إجازة', value: 120, fill: 'var(--chart-3)' },
    { name: 'دورة تدريبية', value: 45, fill: 'var(--chart-4)' },
    { name: 'أخرى', value: 30, fill: 'var(--chart-5)' },
];

const unitData = [
  { unit: 'الوحدة الأولى', count: 350 },
  { unit: 'الوحدة الثانية', count: 420 },
  { unit: 'الوحدة الثالثة', count: 280 },
  { unit: 'الوحدة الرابعة', count: 195 },
];

const trendData = [
    { month: 'يناير', count: 1180 },
    { month: 'فبراير', count: 1195 },
    { month: 'مارس', count: 1210 },
    { month: 'أبريل', count: 1225 },
    { month: 'مايو', count: 1240 },
    { month: 'يونيو', count: 1245 },
];

const chartConfig = {
    count: { label: "العدد" },
    value: { label: "العدد" },
    'chart-1': { color: 'hsl(var(--chart-1))' },
    'chart-2': { color: 'hsl(var(--chart-2))' },
    'chart-3': { color: 'hsl(var(--chart-3))' },
    'chart-4': { color: 'hsl(var(--chart-4))' },
    'chart-5': { color: 'hsl(var(--chart-5))' },
};


export default function StatisticsPage() {
    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2"><BarChart2 className="h-6 w-6"/>إحصائيات شاملة</CardTitle>
                    <CardDescription>نظرة عامة على بيانات الأفراد في النظام.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">الأفراد قيد الخدمة</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,175</div>
                        <p className="text-xs text-muted-foreground">+1.5% عن الشهر الماضي</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">متوسط مدة الخدمة</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8.2 سنوات</div>
                        <p className="text-xs text-muted-foreground">متوسط خدمة الأفراد الحاليين</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">معدل الترقيات</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+15</div>
                        <p className="text-xs text-muted-foreground">ترقية هذا الشهر</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">معدل الغياب</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0.8%</div>
                        <p className="text-xs text-muted-foreground">-0.2% عن الشهر الماضي</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الأفراد حسب الحالة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                           <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                                    <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Card className="shadow-md">
                    <CardHeader>
                        <CardTitle>توزيع الأفراد على الوحدات</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={unitData}>
                                    <XAxis dataKey="unit" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                    <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                    <Bar dataKey="count" fill="var(--chart-2)" radius={4} />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>نمو عدد الأفراد خلال ٦ أشهر</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <ResponsiveContainer width="100%" height={300}>
                             <LineChart data={trendData}>
                                <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <YAxis domain={['dataMin - 20', 'dataMax + 20']} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Line type="monotone" dataKey="count" stroke="var(--chart-1)" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}
