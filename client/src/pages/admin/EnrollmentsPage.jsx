import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { PROGRAM_STYLES, PROGRAM_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import api from '@/lib/api';

const EnrollmentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await api.get('/admin/enrollments');
                setEnrollments(response.data || []);
            } catch (error) {
                console.error("Failed to fetch enrollments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(enrollments.map(enr => enr._id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev =>
            prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
        );
    };

    const copyTableData = () => {
        // Implement copy logic based on displayed data
        alert('Table data copied to clipboard!');
    };

    // Filter logic (simple client-side for now)
    const filteredEnrollments = enrollments.filter(enr =>
        (enr.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (enr.userId?.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Enrollments</h1>
                    <p className="text-sm text-slate-500">Manage all student enrollments, payments, and certificates.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={copyTableData}>
                        <Icon name="Copy" size={16} className="mr-2" />
                        Copy Data
                    </Button>
                    <Button>
                        <Icon name="Download" size={16} className="mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Icon name="Search" className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <Input
                        placeholder="Search by name, email..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select className="w-full md:w-48">
                    <option>Status: All</option>
                    <option>Captured</option>
                    <option>Pending</option>
                    <option>Failed</option>
                </Select>
                <Select className="w-full md:w-48">
                    <option>Type: All</option>
                    <option>Internship</option>
                    <option>Professional</option>
                    <option>Certification</option>
                </Select>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-xs border-b border-slate-200">
                            <tr>
                                <th className="p-4 w-4">
                                    <input type="checkbox" onChange={handleSelectAll} checked={selectedRows.length === enrollments.length && enrollments.length > 0} />
                                </th>
                                <th className="p-4 min-w-[150px]">Student Name</th>
                                <th className="p-4 min-w-[200px]">Email</th>
                                <th className="p-4 min-w-[200px]">Program</th>
                                <th className="p-4 min-w-[120px]">Type</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 min-w-[100px]">Date</th>
                                <th className="p-4 min-w-[250px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-8 text-slate-500">Loading enrollments...</td>
                                </tr>
                            ) : filteredEnrollments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="text-center py-8 text-slate-500">No enrollments found.</td>
                                </tr>
                            ) : (
                                filteredEnrollments.map((row) => {
                                    const type = row.courseId?.type || PROGRAM_TYPES.PROFESSIONAL;
                                    const typeStyle = PROGRAM_STYLES[type] || PROGRAM_STYLES[PROGRAM_TYPES.PROFESSIONAL];
                                    const dateDisplay = row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-GB') : '-';

                                    return (
                                        <tr key={row._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="p-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRows.includes(row._id)}
                                                    onChange={() => handleSelectRow(row._id)}
                                                />
                                            </td>
                                            <td className="p-4 font-semibold text-slate-900">{row.userId?.name || 'Unknown'}</td>
                                            <td className="p-4 text-slate-700">{row.userId?.email || 'N/A'}</td>
                                            <td className="p-4 text-slate-600">{row.courseId?.title || 'Unknown Course'}</td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "inline-flex items-center px-2 py-1 rounded text-xs font-medium border",
                                                    typeStyle.bg,
                                                    typeStyle.text,
                                                    typeStyle.border
                                                )}>
                                                    {type}
                                                </span>
                                            </td>
                                            <td className="p-4 font-medium text-slate-900">{row.courseId?.price || '-'}</td>
                                            <td className="p-4 text-slate-600">{row.status}</td>
                                            <td className="p-4 text-slate-600">{dateDisplay}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button size="sm" variant="ghost" className="bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 text-xs h-8">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Static for now) */}
                <div className="p-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing {filteredEnrollments.length} enrollments</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm" disabled>Next</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnrollmentsPage;
