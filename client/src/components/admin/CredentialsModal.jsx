import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import api from '@/lib/api';

const CredentialsModal = ({ isOpen, onClose, studentId, studentEmail }) => {
    const [step, setStep] = useState(1); // 1: Auth, 2: View Credentials
    const [adminPassword, setAdminPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Credentials to show
    const [credentials, setCredentials] = useState(null);

    const handleAuthenticate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await api.post(`/admin/enrollments/${studentId}/credentials`, {
                adminPassword
            });
            setCredentials(res.data);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please check your password.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            await api.post(`/admin/enrollments/${studentId}/resend-credentials`);
            alert('Credentials resent to the student successfully!');
        } catch (err) {
            alert('Failed to resend credentials: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        // Reset state on close
        setStep(1);
        setAdminPassword('');
        setCredentials(null);
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">
                        {step === 1 ? 'Admin Authentication Required' : 'Student Credentials'}
                    </h3>
                    <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Icon name="X" size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {step === 1 ? (
                        <form onSubmit={handleAuthenticate} className="space-y-4">
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-md text-sm mb-4">
                                <Icon name="ShieldAlert" size={16} className="inline mr-2" />
                                For security reasons, please confirm your admin password to view credentials for <strong>{studentEmail}</strong>.
                            </div>

                            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Admin Password</label>
                                <Input
                                    type="password"
                                    required
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                                disabled={loading}
                            >
                                {loading && <Icon name="Loader2" size={16} className="animate-spin mr-2" />}
                                Authenticate
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="space-y-3">
                                    <div>
                                        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</span>
                                        <div className="font-mono text-slate-900 bg-white p-2 rounded border border-slate-200">
                                            {credentials?.email}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Auto-Generated Password</span>
                                        <div className="font-mono text-slate-900 bg-white p-2 rounded border border-slate-200 flex justify-between items-center">
                                            <span>{credentials?.password}</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(credentials?.password);
                                                    alert('Password copied!');
                                                }}
                                                className="text-slate-400 hover:text-blue-600 focus:outline-none"
                                                title="Copy to clipboard"
                                            >
                                                <Icon name="Copy" size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-sm text-slate-500">
                                <p>Note: If the student has changed their password, the auto-generated password will no longer work, but they can use the 'Forgot Password' flow.</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100">
                                <Button
                                    variant="outline"
                                    onClick={handleClose}
                                    className="flex-1"
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={handleResend}
                                    disabled={loading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {loading ? (
                                        <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                                    ) : (
                                        <Icon name="Send" size={16} className="mr-2" />
                                    )}
                                    Resend Credentials
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CredentialsModal;
