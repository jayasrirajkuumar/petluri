import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const StatCard = ({ title, value, icon, trend, className, onClick }) => {
    return (
        <Card
            className={`${className} ${onClick ? 'cursor-pointer hover:border-brand-blue transition-colors' : ''}`}
            onClick={onClick}
        >
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">{value}</span>
                        {trend && (
                            <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {trend > 0 ? '+' : ''}{trend}%
                            </span>
                        )}
                    </div>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue">
                    <Icon name={icon} size={24} />
                </div>
            </CardContent>
        </Card>
    );
};

export { StatCard };
