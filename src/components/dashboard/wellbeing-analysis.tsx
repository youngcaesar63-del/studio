import { analyzePersonnelWellbeing } from "@/ai/flows/analyze-personnel-wellbeing";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export async function WellbeingAnalysis() {
  try {
    const analysis = await analyzePersonnelWellbeing({
      leaveRequests: "120 فرد في إجازة حاليًا، بزيادة 3.5٪ عن الشهر الماضي.",
      recentActivity: "تمت إضافة 64 فردًا جديدًا هذا الشهر، وتمت ترقية 15 فردًا.",
      otherData: "لوحظ انخفاض طفيف في معدلات الحضور في الوحدة الثالثة.",
    });

    return (
      <Card className="shadow-md bg-gradient-to-tr from-primary/5 via-card to-card dark:from-primary/10">
          <CardHeader>
              <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-primary"/>
                  تحليل معنويات الأفراد
              </CardTitle>
              <CardDescription>
                  هذا التحليل تم إنشاؤه بواسطة الذكاء الاصطناعي Genkit AI
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
  } catch (error) {
    console.error("Wellbeing analysis failed:", error);
    return (
       <Card className="shadow-md border-destructive">
          <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                  <Sparkles className="text-destructive"/>
                  خطأ في تحليل المعنويات
              </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              تعذر تحميل تحليل معنويات الأفراد في الوقت الحالي.
            </p>
          </CardContent>
      </Card>
    )
  }
}
