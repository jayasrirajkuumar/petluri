import React from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Select } from '@/components/ui/Select';
import { PROGRAM_STYLES, PROGRAM_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Mock Data for Reports
const MOCK_REPORTS = [
    {
        id: 1,
        studentName: 'Rahul Verma',
        email: 'rahul.v@example.com',
        program: 'React JS Internship',
        type: PROGRAM_TYPES.INTERNSHIP,
        attendance: '92%',
        quizMarks: '85/100',
        progress: 85,
        status: 'Ongoing'
    },
    {
        id: 2,
        studentName: 'Priya Sharma',
        email: 'priya.s@example.com',
        program: 'Full Stack Web Development',
        type: PROGRAM_TYPES.PROFESSIONAL,
        attendance: '45%',
        quizMarks: 'None',
        progress: 20,
        status: 'Dropout'
    },
    {
        id: 3,
        studentName: 'Amit Patel',
        email: 'amit.p@example.com',
        program: 'Introduction to Python',
        type: PROGRAM_TYPES.FREE_COURSE,
        attendance: '100%',
        quizMarks: '92/100',
        progress: 100,
        status: 'Completed'
    },
    {
        id: 4,
        studentName: 'Meera Krishnan',
        email: 'meera.k@example.com',
        program: 'Introduction to Python',
        type: PROGRAM_TYPES.FREE_COURSE,
        attendance: '88%',
        quizMarks: '75/100',
        progress: 70,
        status: 'Ongoing'
    }
];

const ReportsPage = () => {

    const exportToCSV = () => {
        const headers = ["Student Name", "Email", "Program", "Type", "Attendance", "Quiz Marks", "Progress", "Status"];
        const rows = MOCK_REPORTS.map(row => [
            row.studentName, row.email, row.program, row.type, row.attendance, row.quizMarks, `${row.progress}%`, row.status
        ]);
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "student_reports.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert("Report exported successfully!");
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Icon name="BarChart3" className="text-brand-blue" size={24} />
                        <h1 className="text-2xl font-bold text-slate-900">Student Reports</h1>
                    </div>
                    <p className="text-sm text-slate-500">Track attendance, assessment scores, and overall progress.</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={exportToCSV}>
                    <Icon name="Download" size={16} className="mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <Select className="w-full md:w-64">
                    <option>Program: All</option>
                    <option>React JS Internship</option>
                    <option>Introduction to Python</option>
                </Select>
                <Select className="w-full md:w-48">
                    <option>Status: All</option>
                    <option>Completed</option>
                    <option>Ongoing</option>
                    <option>Dropout</option>
                </Select>
                <Select className="w-full md:w-48">
                    <option>Performance: All</option>
                    <option>Top Performers ({'>'}90%)</option>
                    <option>At Risk ({'<'}50%)</option>
                </Select>
            </div>

            {/* Reports Table */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                            <tr>
                                <th className="p-4">Student Name</th>
                                <th className="p-4">Program</th>
                                <th className="p-4">Attendance</th>
                                <th className="p-4">Quiz Marks</th>
                                <th className="p-4 w-40">Progress</th>
                                <th className="p-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_REPORTS.map((report) => {
                                const typeStyle = PROGRAM_STYLES[report.type] || PROGRAM_STYLES.PROFESSIONAL;
                                return (
                                    <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800">{report.studentName}</div>
                                            <div className="text-[10px] text-slate-500">{report.email}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-slate-700 font-medium mb-1">{report.program}</div>
                                            <span className={cn(
                                                "px-1.5 py-0.5 rounded text-[10px] border",
                                                typeStyle.bg,
                                                typeStyle.text,
                                                typeStyle.border
                                            )}>
                                                {report.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">{report.attendance}</td>
                                        <td className="p-4">
                                            {report.quizMarks !== 'None' ? (
                                                <span className="font-mono text-slate-700 font-bold bg-slate-100 px-2 py-1 rounded">
                                                    {report.quizMarks}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">No Data</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full",
                                                            report.progress === 100 ? "bg-green-500" :
                                                                report.progress < 40 ? "bg-red-500" : "bg-blue-500"
                                                        )}
                                                        style={{ width: `${report.progress}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] text-slate-500 font-medium w-6">{report.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-[10px] font-bold uppercase",
                                                report.status === 'Completed' ? "bg-green-100 text-green-700" :
                                                    report.status === 'Dropout' ? "bg-red-100 text-red-700" :
                                                        "bg-blue-100 text-blue-700"
                                            )}>
                                                {report.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
