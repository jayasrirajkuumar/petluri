import * as icons from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Icon Wrapper Component
 * Usage: <Icon name="User" size="md" className="text-brand-blue" />
 */
export const Icon = ({ name, size = 'md', className, ...props }) => {
    // 1. Normalize name to PascalCase (just in case) or direct lookup
    // 2. Safe lookup
    const LucideIcon = icons[name] || icons[name.charAt(0).toUpperCase() + name.slice(1)];

    if (!LucideIcon) {
        console.warn(`Icon '${name}' not found in lucide-react library`);
        // Return a generic fallback icon (HelpCircle) or null if not found either
        const Fallback = icons.HelpCircle || icons.AlertCircle;
        return Fallback ? <Fallback size={size} className={cn("text-red-500", className)} {...props} /> : null;
    }

    const sizeMap = {
        sm: 16,
        md: 20,
        lg: 24,
        xl: 32,
        "2xl": 40,
    };

    const pixelSize = typeof size === 'number' ? size : (sizeMap[size] || 20);

    return (
        <LucideIcon
            size={pixelSize}
            className={cn("stroke-2", className)}
            {...props}
        />
    );
};
