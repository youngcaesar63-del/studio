import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { UserCheck } from "lucide-react"

export default function UsersPage() {
    return (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
                <UserCheck className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">المستخدمون</h3>
                <p className="text-sm text-muted-foreground">
                    هذه الصفحة قيد الإنشاء.
                </p>
            </div>
        </div>
    )
}
