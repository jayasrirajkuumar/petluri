import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', children, isLoading, disabled, ...props }, ref) => {
    const variants = {
        default: "bg-brand-yellow text-slate-900 hover:bg-brand-yellow/90 font-semibold shadow-sm", // Primary CTA (Yellow)
        secondary: "bg-brand-blue text-white hover:bg-brand-blue/90 shadow-sm", // Secondary (Blue)
        outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
        ghost: "hover:bg-slate-100 text-slate-700",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        link: "text-brand-blue underline-offset-4 hover:underline",
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            ref={ref}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
