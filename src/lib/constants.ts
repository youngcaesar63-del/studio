

export const ranks = ['فريق أول', 'فريق', 'لواء', 'عميد', 'عقيد', 'مقدم', 'رائد', 'نقيب', 'ملازم أول', 'ملازم'].sort((a,b) => {
    const rankOrder: { [key: string]: number } = { 'فريق أول': 1, 'فريق': 2, 'لواء': 3, 'عميد': 4, 'عقيد': 5, 'مقدم': 6, 'رائد': 7, 'نقيب': 8, 'ملازم أول': 9, 'ملازم': 10 };
    return (rankOrder[a] || 99) - (rankOrder[b] || 99);
});

export const specializations = ['ركن', 'مهندس', 'بحري', 'طيار', 'مهندس ركن', 'ركن بحري', 'ركن طيار', 'د.ركن', 'مهندس د.ركن', 'تقني', 'خريج', 'لا يوجد'].sort((a,b) => a.localeCompare(b, 'ar'));

export const academicQualifications = ['شهادة إبتدائية', 'شهادة متوسطة', 'شهادة ثانوية', 'دبلوم', 'بكالوريوس', 'ماجستير', 'دكتوراه', 'لا يوجد'].sort((a,b) => a.localeCompare(b, 'ar'));

export const administrations = ['إدارة الشئون الإدارية', 'الإدارة العامة للاستخبارات', 'الإدارة العامة للعمل الخاص', 'الإدارة العامة للمعلومات الاستراتيجية', 'الإدارة العامة للشئون الفنية', 'الإدارة العامة للأمن العسكري', 'رئاسة الهيئة'].sort((a,b) => a.localeCompare(b, 'ar'));

export const statuses = ['إجازة', 'إلحاق', 'إرسالية مرضية', 'إنتداب', 'بالطابور', 'دورة تدريبية', 'غياب', 'عمليات', 'منقول', 'نقل و لم يبلغ', 'هروب', 'عاصفة الحزم', 'ملحقية', 'الية', 'مامورية'].sort((a,b) => a.localeCompare(b, 'ar'));

export const statusesWithDetails = ['إجازة', 'غياب', 'هروب', 'ملحقية', 'إلحاق', 'الية', 'مامورية', 'إنتداب', 'عمليات', 'عاصفة الحزم', 'منقول', 'نقل و لم يبلغ', 'دورة تدريبية'];
export const statusRequiresDate = ['إجازة', 'غياب', 'هروب'];


export const getStatusDetailLabel = (status: string): string => {
    switch(status) {
        case 'إلحاق': return 'الجهة الملحق عليها';
        case 'الية': return 'اسم الآلية';
        case 'مامورية': return 'اسم المأمورية';
        case 'إنتداب': return 'الجهة المنتدب إليها';
        case 'عمليات': return 'منطقة العمليات';
        case 'عاصفة الحزم': return 'اسم اللواء/الكتيبة';
        case 'منقول': return 'الجهة المنقول منها';
        case 'نقل و لم يبلغ': return 'الجهة المنقول منها';
        case 'دورة تدريبية': return 'اسم الدورة';
        case 'ملحقية': return 'اسم الملحقية';
        case 'إجازة': return 'آخر يوم للإجازة';
        case 'غياب': return 'تاريخ بداية الغياب';
        case 'هروب': return 'تاريخ الهروب';
        default: return 'تفاصيل';
    }
}


export const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const maritalStatuses = ['أعزب', 'متزوج', 'مطلق', 'أرمل'];

export const religions = ['مسلم', 'مسيحي', 'أخرى'];

export const certificateTypes = ['مستديمة', 'موقتة'];

export const states = ["الخرطوم", "الجزيرة", "البحر الأحمر", "كسلا", "القضارف", "سنار", "النيل الأبيض", "النيل الأزرق", "الشمالية", "نهر النيل", "غرب كردفان", "جنوب كردفان", "شمال دارفور", "غرب دارفور", "جنوب دارفور", "شرق دارفور", "وسط دارفور"].sort((a,b) => a.localeCompare(b, 'ar'));

export const courseGrades = ['أ', 'ب', 'جـ', 'د'];

export const generateBatches = () => {
  const batches: { value: string, label: string }[] = [];
  for (let i = 70; i >= 30; i--) batches.push({ value: `الدفعة ${i}`, label: `الدفعة ${i}` });
  for (let i = 25; i >= 1; i--) batches.push({ value: `تقانة ${i}`, label: `تقانة ${i}` });
  for (let i = 3; i >= 1; i--) batches.push({ value: `جامعيين ${i}`, label: `جامعيين ${i}` });
  for (let i = 40; i >= 1; i--) batches.push({ value: `فنيين ${i}`, label: `فنيين ${i}` });
  for (let i = 20; i >= 1; i--) batches.push({ value: `تأهيلية ${i}`, label: `تأهيلية ${i}` });
  for (let i = 10; i >= 1; i--) batches.push({ value: `اكرامية ${i}`, label: `اكرامية ${i}` });
  batches.push({ value: 'لا يوجد', label: 'لا يوجد' });
  return batches;
};
