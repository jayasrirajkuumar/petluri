import React from 'react';
import { cn } from '@/lib/utils';

const Badge = ({ className, variant = "default", ...props }) => {
    const variants = {
        default: "border-transparent bg-brand-blue text-white hover:bg-brand-blue/80", // Brand Default
        secondary: "border-transparent bg-brand-yellow text-slate-900 hover:bg-brand-yellow/80", // Action/Highlight
        destructive: "border-transparent bg-red-500 text-white hover:bg-red-600", // Danger
        outline: "text-slate-950 border-slate-200",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600", // Success
        warning: "border-transparent bg-orange-500 text-white hover:bg-orange-600",
    };

    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2", variants[variant], className)} {...props} />
    );
};

export { Badge };
