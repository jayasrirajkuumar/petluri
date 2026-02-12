import React, { useState } from 'react';
import { cn } from '@/lib/utils';

const Tabs = ({ defaultValue, className, children }) => {
    const [activeTab, setActiveTab] = useState(defaultValue);

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
    });

    return (
        <div className={cn("w-full", className)}>
            {childrenWithProps}
        </div>
    );
};

const TabsList = ({ className, children, activeTab, setActiveTab }) => {
    // Pass state down to triggers
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { activeTab, setActiveTab });
        }
        return child;
    });

    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500", className)}>
            {childrenWithProps}
        </div>
    );
};

const TabsTrigger = ({ value, children, className, activeTab, setActiveTab }) => {
    const isActive = activeTab === value;
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive ? "bg-white text-slate-950 shadow-sm" : "hover:bg-slate-200/50 hover:text-slate-900",
                className
            )}
            onClick={() => setActiveTab(value)}
        >
            {children}
        </button>
    );
};

const TabsContent = ({ value, children, className, activeTab }) => {
    if (value !== activeTab) return null;

    return (
        <div
            className={cn("mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2", className)}
        >
            {children}
        </div>
    );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
