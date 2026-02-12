import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Loader = ({ className, size = "md" }) => {
    const sizeMap = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };

    return (
        <div className="flex justify-center items-center w-full p-4">
            <Loader2 className={cn("animate-spin text-brand-blue", sizeMap[size], className)} />
        </div>
    );
};

export { Loader };
