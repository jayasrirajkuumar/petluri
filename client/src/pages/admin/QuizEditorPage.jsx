import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { TextArea } from '@/components/ui/TextArea';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { PROGRAM_TYPES } from '@/lib/constants';

// Initial state for a new quesion
const EMPTY_QUESTION = {
    id: null,
    text: '',
    type: 'MCQ',
    marks: 1,
    image: null,
    options: [
        { id: 'A', text: '', isCorrect: false },
        { id: 'B', text: '', isCorrect: false },
        { id: 'C', text: '', isCorrect: false },
        { id: 'D', text: '', isCorrect: false }
    ]
};

const QuizEditorPage = () => {
    const { id } = useParams();
    const isEditMode = !!id;

    // Quiz Metadata State
    const [quizDetails, setQuizDetails] = useState({
        title: isEditMode ? 'Unsupervised Learning' : '',
        program: isEditMode ? 'AICTE Internship on Data Analytics...' : '',
        description: isEditMode ? 'Complete it on time' : '',
        associationType: 'module', // 'module' or 'end'
        moduleId: 'Module 4',
        dateStart: '2026-02-05',
        timeStart: '01:45',
        dateEnd: '2026-02-15',
        timeEnd: '22:15',
        passingScore: 100
    });

    // Questions State
    const [questions, setQuestions] = useState([
        {
            id: 1,
            text: 'Which of the following best defines Artificial Intelligence (AI)?',
            type: 'MCQ',
            marks: 2,
            options: [
                { id: 'A', text: 'A field of study focused on creating machines that mimic human intelligence', isCorrect: true },
                { id: 'B', text: 'A software that works only with numbers', isCorrect: false },
                { id: 'C', text: 'A hardware device that stores information', isCorrect: false },
                { id: 'D', text: 'A programming language', isCorrect: false }
            ]
        },
        {
            id: 2,
            text: 'Which of the following is a subset of AI that focuses on learning from data?',
            type: 'MCQ',
            marks: 2,
            options: [
                { id: 'A', text: 'Deep Learning', isCorrect: false },
                { id: 'B', text: 'Machine Learning', isCorrect: true },
                { id: 'C', text: 'Data Mining', isCorrect: false },
                { id: 'D', text: 'Robotics', isCorrect: false }
            ]
        }
    ]);

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setQuizDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleQuestionChange = (qIndex, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[qIndex][field] = value;
        setQuestions(updatedQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'isCorrect') {
            // Uncheck others if radio
            updatedQuestions[qIndex].options.forEach((opt, idx) => {
                opt.isCorrect = idx === oIndex;
            });
        } else {
            updatedQuestions[qIndex].options[oIndex][field] = value;
        }
        setQuestions(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { ...EMPTY_QUESTION, id: Date.now() }]);
    };

    const deleteQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions.splice(index, 1);
        setQuestions(updatedQuestions);
    };

    return (
        <div className="space-y-8 pb-32">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                <Link to="/admin/quizzes" className="text-slate-400 hover:text-slate-600">
                    <Icon name="ArrowLeft" size={20} />
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">{isEditMode ? 'Edit Quiz' : 'Create Quiz'}</h1>
                    <p className="text-xs text-slate-500">Update quiz details, questions, and settings.</p>
                </div>
            </div>

            {/* General Info Form */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Quiz Title</label>
                    <Input name="title" value={quizDetails.title} onChange={handleDetailChange} placeholder="Enter quiz title..." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Program</label>
                        <Select name="program" value={quizDetails.program} onChange={handleDetailChange}>
                            <option value="">Select Program...</option>
                            <option>AICTE Internship on Data Analytics...</option>
                            <option>React JS Internship</option>
                            <option>Introduction to Python</option>
                        </Select>
                    </div>
                    {/* Association Logic */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Visibility Context</label>
                        <div className="flex gap-4 items-center h-10">
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input
                                    type="radio"
                                    name="associationType"
                                    value="module"
                                    checked={quizDetails.associationType === 'module'}
                                    onChange={handleDetailChange}
                                    className="text-orange-500 focus:ring-orange-500"
                                />
                                After Module
                            </label>
                            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                                <input
                                    type="radio"
                                    name="associationType"
                                    value="end"
                                    checked={quizDetails.associationType === 'end'}
                                    onChange={handleDetailChange}
                                    className="text-orange-500 focus:ring-orange-500"
                                />
                                End of Program
                            </label>
                        </div>
                        {quizDetails.associationType === 'module' && (
                            <Select name="moduleId" value={quizDetails.moduleId} onChange={handleDetailChange} className="mt-2">
                                <option>Module 1</option>
                                <option>Module 2</option>
                                <option>Module 3</option>
                                <option>Module 4</option>
                            </Select>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase">Description</label>
                    <TextArea name="description" value={quizDetails.description} onChange={handleDetailChange} placeholder="Description..." rows={2} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Passing Score (%)</label>
                        <Input type="number" name="passingScore" value={quizDetails.passingScore} onChange={handleDetailChange} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Start Time</label>
                        <div className="flex gap-2">
                            <Input type="date" name="dateStart" value={quizDetails.dateStart} onChange={handleDetailChange} className="flex-1" />
                            <Input type="time" name="timeStart" value={quizDetails.timeStart} onChange={handleDetailChange} className="w-24" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">End Time</label>
                        <div className="flex gap-2">
                            <Input type="date" name="dateEnd" value={quizDetails.dateEnd} onChange={handleDetailChange} className="flex-1" />
                            <Input type="time" name="timeEnd" value={quizDetails.timeEnd} onChange={handleDetailChange} className="w-24" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Questions Builder */}
            <div>
                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                    <h2 className="text-sm font-bold text-brand-blue flex items-center gap-2">
                        Questions ({questions.length})
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-white text-brand-blue border-blue-200 border-dashed">
                            <Icon name="Upload" size={14} className="mr-2" />
                            Import CSV/Excel
                        </Button>
                        <Button size="sm" onClick={addQuestion} className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50">
                            + Add Question
                        </Button>
                    </div>
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded text-xs text-brand-blue mb-4">
                    <span className="font-bold">CSV/Excel Format Required:</span> Question, Answer (A/B/C/D), Option 1, Option 2, Option 3, Option 4, Marks
                </div>

                <div className="space-y-6">
                    {questions.map((q, qIndex) => (
                        <div key={q.id || qIndex} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm relative group">
                            {/* Delete Button */}
                            <button
                                onClick={() => deleteQuestion(qIndex)}
                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1"
                            >
                                <Icon name="Trash2" size={16} />
                            </button>

                            <div className="grid grid-cols-12 gap-4 mb-4">
                                <div className="col-span-12 md:col-span-10 space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Question {qIndex + 1}</label>
                                    <Input
                                        value={q.text}
                                        onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                        placeholder="Type your question here..."
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-1 space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Type</label>
                                    <Select value={q.type} onChange={(e) => handleQuestionChange(qIndex, 'type', e.target.value)}>
                                        <option>MCQ</option>
                                    </Select>
                                </div>
                                <div className="col-span-6 md:col-span-1 space-y-1">
                                    <label className="text-xs font-bold text-slate-700">Marks</label>
                                    <Input
                                        type="number"
                                        value={q.marks}
                                        onChange={(e) => handleQuestionChange(qIndex, 'marks', e.target.value)}
                                    />
                                </div>
                            </div>

                            <Button variant="outline" size="sm" className="mb-4 text-xs h-8">
                                <Icon name="Image" size={14} className="mr-2" />
                                Upload Image
                            </Button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIndex) => (
                                    <div key={opt.id} className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name={`q${qIndex}_correct`}
                                            className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                            checked={opt.isCorrect}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, 'isCorrect', e.target.checked)}
                                        />
                                        <div className="flex-1 relative">
                                            <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">{opt.id}.</span>
                                            <Input
                                                className={cn("pl-8", opt.isCorrect ? "border-purple-300 bg-purple-50" : "")}
                                                value={opt.text}
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, 'text', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Save Bar */}
            <div className="fixed bottom-0 left-64 right-0 p-4 bg-white border-t border-slate-200 z-20 flex justify-end gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Link to="/admin/quizzes">
                    <Button variant="outline">Cancel</Button>
                </Link>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white min-w-[120px]">
                    Save Quiz
                </Button>
            </div>
        </div>
    );
};

export default QuizEditorPage;
