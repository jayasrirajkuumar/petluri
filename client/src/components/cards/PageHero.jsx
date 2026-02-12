import React from 'react';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

const PageHero = ({
    title,
    description,
    badge,
    variant = 'primary',
    iconName = 'Briefcase',
    className
}) => {

    const variants = {
        primary: "bg-gradient-to-r from-purple-800 to-purple-600",
        blue: "bg-gradient-to-r from-blue-700 to-blue-500",
        green: "bg-gradient-to-r from-emerald-700 to-emerald-500",
        dark: "bg-gradient-to-r from-slate-900 to-slate-700",
    };

    return (
        <div className={cn(
            "relative overflow-hidden rounded-2xl p-8 md:p-10 mb-8 text-white shadow-lg",
            variants[variant] || variants.primary,
            className
        )}>
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black/10 rounded-full blur-2xl opacity-30 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="max-w-2xl">
                    {badge && (
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wide text-white bg-white/20 rounded-full uppercase backdrop-blur-sm">
                            {badge}
                        </span>
                    )}
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
                        {title}
                    </h1>
                    <p className="text-lg md:text-xl text-white/90 font-light leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Right Side Icon/Graphic */}
                <div className="hidden md:block opacity-20 transform rotate-12 scale-150 mr-8">
                    <Icon name={iconName} size="xl" className="w-32 h-32 md:w-48 md:h-48 text-white" />
                </div>
            </div>
        </div>
    );
};

export default PageHero;
