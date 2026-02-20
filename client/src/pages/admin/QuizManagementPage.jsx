import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Icon } from '@/components/ui/Icon';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import api from '@/lib/api';
import QuizModal from '@/components/admin/QuizModal';

const QuizManagementPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [showQuizModal, setShowQuizModal] = useState(false);
    const [editingQuizId, setEditingQuizId] = useState(null);

    const fetchQuizzes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/quizzes');
            setQuizzes(response.data || []);
        } catch (error) {
            console.error("Failed to fetch quizzes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleQuizSaved = () => {
        setShowQuizModal(false);
        setEditingQuizId(null);
        fetchQuizzes(); // Refresh list
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this quiz?")) return;
        try {
            // Assuming there's a delete endpoint, if not, we can implement or skip
            // await api.delete(`/admin/quizzes/${id}`);
            alert("Delete functionality not yet implemented in backend for specific quizzes.");
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

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
                <Button onClick={() => {
                    setEditingQuizId(null);
                    setShowQuizModal(true);
                }}>
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
                                    <TableCell className="text-slate-600">
                                        {quiz.courseId ? (
                                            <span className="text-blue-600 font-medium">{quiz.courseId.title}</span>
                                        ) : (
                                            <span className="text-slate-400 italic">Unassigned</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{quiz.questions?.length || 0}</TableCell>
                                    <TableCell>{quiz.timeLimit} mins</TableCell>
                                    <TableCell>{quiz.passingScore}%</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingQuizId(quiz._id);
                                                    setShowQuizModal(true);
                                                }}
                                            >
                                                <Icon name="Edit" size={16} className="text-slate-500" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(quiz._id)}
                                            >
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

            {showQuizModal && (
                <QuizModal
                    quizId={editingQuizId}
                    onClose={() => {
                        setShowQuizModal(false);
                        setEditingQuizId(null);
                    }}
                    onSuccess={handleQuizSaved}
                />
            )}
        </div>
    );
};

export default QuizManagementPage;
