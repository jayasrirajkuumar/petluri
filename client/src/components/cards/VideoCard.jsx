import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';

const VideoCard = ({ title, duration, isLocked, isCompleted, isActive, onClick, className }) => {
    return (
        <Card
            onClick={!isLocked ? onClick : undefined}
            className={cn(
                "cursor-pointer transition-all hover:bg-slate-50",
                isActive && "border-brand-blue bg-blue-50/50 hover:bg-blue-50/50",
                isLocked && "opacity-60 cursor-not-allowed hover:bg-white",
                className
            )}
        >
            <CardContent className="p-4 flex items-center gap-4">
                <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                    isCompleted ? "bg-green-100 text-green-600" :
                        isActive ? "bg-brand-blue text-white" :
                            isLocked ? "bg-slate-100 text-slate-400" : "bg-slate-100 text-slate-500"
                )}>
                    {isCompleted ? <Icon name="Check" size="sm" /> :
                        isLocked ? <Icon name="Lock" size="sm" /> :
                            <Icon name="Play" size="sm" className={isActive ? "fill-current" : ""} />}
                </div>

                <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", isActive ? "text-brand-blue" : "text-slate-900")}>
                        {title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{duration}</p>
                </div>
            </CardContent>
        </Card>
    );
};

export { VideoCard };
