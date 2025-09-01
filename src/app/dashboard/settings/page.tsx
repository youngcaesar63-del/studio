import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Settings as SettingsIcon } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
                <SettingsIcon className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">الإعدادات</h3>
                <p className="text-sm text-muted-foreground">
                    هذه الصفحة قيد الإنشاء.
                </p>
            </div>
        </div>
    )
}
