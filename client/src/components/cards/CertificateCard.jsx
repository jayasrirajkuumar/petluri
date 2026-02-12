import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';

const CertificateCard = ({ title, issueDate, certificateId, onDownload, onVerify }) => {
    return (
        <Card className="group hover:shadow-lg transition-shadow border-l-4 border-l-brand-blue">
            <CardContent className="p-0 flex flex-col md:flex-row">
                {/* Visual Preview Stub */}
                <div className="bg-slate-100 w-full md:w-48 h-32 md:h-auto flex items-center justify-center border-r border-slate-100 relative overflow-hidden">
                    <Icon name="Award" className="text-slate-300 h-16 w-16" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-900 mb-1">{title}</h3>
                            <Badge variant="success" className="shrink-0">VERIFIED</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Issued on: {issueDate}</p>
                        <p className="text-xs font-mono text-slate-400">ID: {certificateId}</p>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <Button size="sm" variant="outline" onClick={onDownload} className="gap-2">
                            <Icon name="Download" size={14} /> Download
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onVerify} className="gap-2">
                            <Icon name="QrCode" size={14} /> Verify
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export { CertificateCard };
