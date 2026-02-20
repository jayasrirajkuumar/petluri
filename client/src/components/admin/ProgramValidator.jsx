import React, { useMemo } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { validateProgram } from '@/utils/programValidation';

const ProgramValidator = ({ formData }) => {

    const status = useMemo(() => {
        return validateProgram(formData);
    }, [formData]);

    return (
        <Card className="border-slate-200 shadow-sm bg-slate-50 h-full">
            <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold text-slate-800">Publish Readiness</CardTitle>
                    {status.isReady ? (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            <Icon name="CheckCircle" size={14} />
                            READY
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                            <Icon name="AlertCircle" size={14} />
                            INCOMPLETE
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5">
                {Object.entries(status.checks).map(([key, section]) => (
                    <div key={key} className="space-y-2">
                        <div className="flex items-center gap-2">
                            {section.isValid ? (
                                <div className="text-green-500"><Icon name="Check" size={16} /></div>
                            ) : (
                                <div className="text-slate-300"><Icon name="X" size={16} /></div>
                            )}
                            <h4 className={`text-sm font-medium ${section.isValid ? 'text-slate-900' : 'text-slate-500'}`}>
                                {section.label}
                            </h4>
                        </div>

                        {/* Only show detailed items if invalid or for inspection */}
                        <ul className="pl-7 space-y-1.5">
                            {section.items.map((item, idx) => (
                                <li key={idx} className="text-xs flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.valid ? 'bg-green-400' : 'bg-red-300'}`} />
                                    <span className={item.valid ? 'text-slate-600' : 'text-red-600'}>
                                        {item.label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default ProgramValidator;
