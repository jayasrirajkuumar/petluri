import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';

const QuizManagementPage = () => {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await api.get('/admin/quizzes');
                setQuizzes(response.data || []);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const filteredQuizzes = quizzes.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Quiz Management</h1>
                    <p className="text-sm text-slate-500">Create, edit, and manage quizzes for all courses.</p>
                </div>
                <Button onClick={() => navigate('/admin/quizzes/create')}>
                    <Icon name="Plus" size={16} className="mr-2" />
                    Create New Quiz
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                    <Icon name="Search" className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <Input
                        placeholder="Search quizzes..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Quizzes List */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Quiz Title</TableHead>
                            <TableHead>Associated Course</TableHead>
                            <TableHead>Questions</TableHead>
                            <TableHead>Time Limit</TableHead>
                            <TableHead>Passing Score</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    Loading quizzes...
                                </TableCell>
                            </TableRow>
                        ) : filteredQuizzes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                    No quizzes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredQuizzes.map((quiz) => (
                                <TableRow key={quiz._id}>
                                    <TableCell className="font-medium text-slate-900">{quiz.title}</TableCell>
                                    <TableCell className="text-slate-600">{quiz.courseId?.title || 'Unassigned'}</TableCell>
                                    <TableCell>{quiz.questions?.length || 0}</TableCell>
                                    <TableCell>{quiz.timeLimit} mins</TableCell>
                                    <TableCell>{quiz.passingScore}%</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => navigate(`/admin/quizzes/edit/${quiz._id}`)}
                                            >
                                                <Icon name="Edit" size={16} className="text-slate-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Icon name="Trash2" size={16} className="text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default QuizManagementPage;
