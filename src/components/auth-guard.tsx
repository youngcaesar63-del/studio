
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { Skeleton } from './ui/skeleton';

export function AuthGuard({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            // In a real app, you'd have a more robust check (e.g., validate a token)
            const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';
            setIsAuthenticated(sessionAuth);
            setIsVerifying(false);

            if (!sessionAuth) {
                router.replace('/login');
            }
        };

        checkAuth();
    }, [pathname, router]); // Re-check only when path changes

    if (isVerifying) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return null; // or a login page redirect, though the effect handles it.
}
