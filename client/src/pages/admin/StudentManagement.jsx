import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Pagination } from '@/components/ui/Pagination';

const StudentManagement = () => {
    // Mock Data
    const students = [
        { id: 1, name: 'John Doe', email: 'john@example.com', course: 'React Masterclass', progress: 45, status: 'Active' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', course: 'Digital Marketing', progress: 100, status: 'Certified' },
        { id: 3, name: 'Robert Fox', email: 'robert@example.com', course: 'Python Basics', progress: 12, status: 'Inactive' },
    ];

    return (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-900">Student Directory</h2>
                <Button variant="outline" size="sm"><Icon name="Download" size={14} className="mr-2" /> Export CSV</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Enrolled Program</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {students.map((student) => (
                        <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell className="text-slate-500">{student.email}</TableCell>
                            <TableCell>{student.course}</TableCell>
                            <TableCell>{student.progress}%</TableCell>
                            <TableCell>
                                <Badge variant={student.status === 'Certified' ? 'success' : student.status === 'Active' ? 'default' : 'secondary'}>
                                    {student.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><Icon name="MoreHorizontal" size={16} /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination currentPage={1} totalPages={5} onPageChange={() => { }} className="justify-end" />
        </div>
    );
};

export default StudentManagement;
