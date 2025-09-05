'use client';

import { useEffect, useState } from 'react';
import { analyzePersonnelWellbeing, AnalyzePersonnelWellbeingOutput } from "@/ai/flows/analyze-personnel-wellbeing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, Loader2 } from "lucide-react";
import { getLocalStorage } from '@/lib/localStorage-helpers';
import { Activity } from '@/lib/activity-log';

export function WellbeingAnalysis() {
  const [analysis, setAnalysis] = useState<AnalyzePersonnelWellbeingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDataAndAnalyze = async () => {
      try {
        const personnelData = getLocalStorage('personnelData', []);
        const activityLog: Activity[] = getLocalStorage('activityLog', []);

        const onLeaveCount = personnelData.filter((p: any) => p.status === 'إجازة').length;
        const newPersonnelCount = activityLog.filter(a => a.type === 'add_personnel').length;
        const promotionsCount = activityLog.filter(a => a.type === 'promotion').length;

        const leaveRequestsSummary = `${onLeaveCount} ضباط في إجازة حاليًا.`;
        const recentActivitySummary = `تمت إضافة ${newPersonnelCount} ضباط جدد مؤخراً، وتمت ترقية ${promotionsCount} ضباط.`;
        
        const result = await analyzePersonnelWellbeing({
          leaveRequests: leaveRequestsSummary,
          recentActivity: recentActivitySummary,
        });

        setAnalysis(result);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error("Wellbeing analysis failed:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndAnalyze();
  }, []);

  if (loading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="animate-spin text-primary" />
            جاري تحليل معنويات الضباط...
          </CardTitle>
          <CardDescription>
            يقوم الذكاء الاصطناعي Genkit AI بتحليل البيانات الحقيقية الآن.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-24"></CardContent>
      </Card>
    );
  }

  if (error) {
    return (
       <Card className="shadow-md border-destructive">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="text-destructive"/>
                  خطأ في تحليل المعنويات
              </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive/90">
              تعذر تحميل تحليل معنويات الضباط في الوقت الحالي. قد يكون هذا بسبب مشكلة في الاتصال أو خطأ في النظام.
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              تفاصيل الخطأ: {error}
            </p>
          </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card className="shadow-md bg-gradient-to-tr from-primary/5 via-card to-card dark:from-primary/10">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Sparkles className="text-primary"/>
                تحليل معنويات الضباط
            </CardTitle>
            <CardDescription>
                هذا التحليل تم إنشاؤه بواسطة الذكاء الاصطناعي Genkit AI بناءً على بيانات النظام الحية.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div>
                <h4 className="font-semibold mb-1 text-foreground">ملخص</h4>
                <p className="text-sm text-muted-foreground">{analysis.summary}</p>
            </div>
            <div>
                <h4 className="font-semibold mb-1 text-foreground">توصيات</h4>
                <p className="text-sm text-muted-foreground">{analysis.recommendations}</p>
            </div>
        </CardContent>
    </Card>
  );
}
