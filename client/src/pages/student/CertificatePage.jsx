import React from 'react';
import { CertificateCard } from '@/components/cards/CertificateCard';

const CertificatePage = () => {
    const certificates = [
        {
            id: 1,
            title: 'Certified Digital Marketer',
            issueDate: 'March 15, 2026',
            certificateId: 'CDM-2026-8821'
        },
        {
            id: 2,
            title: 'React Professional Certification',
            issueDate: 'Jan 10, 2026',
            certificateId: 'RPC-2026-1102'
        }
    ];

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">My Certificates</h1>
                <p className="text-slate-500">View and download your earned credentials.</p>
            </div>

            <div className="grid gap-6">
                {certificates.map((cert) => (
                    <CertificateCard
                        key={cert.id}
                        {...cert}
                        onDownload={() => alert(`Downloading ${cert.title}`)}
                        onVerify={() => alert(`Verifying ${cert.certificateId}`)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CertificatePage;
