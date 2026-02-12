import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const Breadcrumb = ({ className }) => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className={cn("text-sm text-slate-500 mb-6 flex items-center", className)} aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-blue transition-colors flex items-center">
                <Home className="h-4 w-4 mr-1" />
            </Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                const isLast = index === pathnames.length - 1;
                const formattedName = name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); // Capitalize and remove hyphens

                return (
                    <span key={name} className="flex items-center">
                        <ChevronRight className="h-4 w-4 mx-2 text-slate-300" />
                        {isLast ? (
                            <span className="font-medium text-slate-900">{formattedName}</span>
                        ) : (
                            <Link to={routeTo} className="hover:text-brand-blue transition-colors">
                                {formattedName}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
};

export { Breadcrumb };
