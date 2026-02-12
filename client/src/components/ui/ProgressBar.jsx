import React from 'react';
import { cn } from '@/lib/utils';

const ProgressBar = ({ value = 0, max = 100, className, variant = 'default' }) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    const variants = {
        default: "bg-brand-blue",
        success: "bg-green-500",
        warning: "bg-brand-yellow",
        danger: "bg-red-500",
    };

    return (
        <div className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-100", className)}>
            <div
                className={cn("h-full transition-all duration-500 ease-in-out", variants[variant])}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export { ProgressBar };
