import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import api from '@/lib/api';

const QuizModal = ({ quizId, onClose, onSuccess }) => {
    const [mode, setMode] = useState('choice'); // 'choice', 'manual', 'csv'
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Manual Form State
    const [manualForm, setManualForm] = useState({
        title: '',
        passingScore: 70,
        timeLimit: 30,
        questions: [] // Array of { questionText, options: [], correctAnswer: '' }
    });

    // CSV State
    const [csvFile, setCsvFile] = useState(null);

    useEffect(() => {
        if (quizId) {
            setFetching(true);
            setMode('manual'); // Default to manual for editing
            const fetchQuiz = async () => {
                try {
                    const res = await api.get(`/admin/quizzes/${quizId}`);
                    const quiz = res.data;
                    setManualForm({
                        title: quiz.title,
                        passingScore: quiz.passingScore,
                        timeLimit: quiz.timeLimit,
                        questions: quiz.questions
                    });
                } catch (error) {
                    console.error("Failed to fetch quiz", error);
                    alert("Failed to load quiz details");
                } finally {
                    setFetching(false);
                }
            };
            fetchQuiz();
        }
    }, [quizId]);

    // ... (CSV Helper functions: downloadTemplate, parseCSV - kept same)
    const downloadTemplate = () => {
        const headers = ['Question Text', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer (A/B/C/D)', 'Points'];
        const sample = ['What is React?', 'A Library', 'A Framework', 'A Database', 'A Language', 'A', '1'];
        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + sample.join(",");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "quiz_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const parseCSV = (text) => {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const questions = [];
        const map = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, 'a': 0, 'b': 1, 'c': 2, 'd': 3 };

        // Skip header
        for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim());
            if (parts.length < 6) continue;

            const [qText, optA, optB, optC, optD, correctChar, pts] = parts;
            const options = [optA, optB, optC, optD];

            let correctText = '';
            const correctIndex = map[correctChar];
            if (correctIndex !== undefined && options[correctIndex]) {
                correctText = options[correctIndex];
            } else {
                correctText = correctChar; // Fallback
            }

            questions.push({
                questionText: qText,
                options: options,
                correctAnswer: correctText,
                points: pts ? Number(pts) : 1
            });
        }
        return questions;
    };

    const handleCreate = async () => {
        if (!manualForm.title) {
            alert("Please enter a quiz title");
            return;
        }
        if (manualForm.questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                title: manualForm.title,
                passingScore: Number(manualForm.passingScore),
                timeLimit: Number(manualForm.timeLimit),
                questions: manualForm.questions,
                courseId: null // Optional as per backend update
            };

            let res;
            if (quizId) {
                res = await api.put(`/admin/quizzes/${quizId}`, payload);
            } else {
                res = await api.post('/admin/create-quiz', payload);
            }

            onSuccess(res.data);
            onClose();
        } catch (error) {
            console.error("Quiz save failed", error);
            alert("Failed to save quiz: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleCSVUpload = () => {
        if (!csvFile) return alert("Please upload a CSV file");

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const questions = parseCSV(text);
            if (questions.length === 0) return alert("No questions found in CSV");

            // Merge CSV questions into manual form and switch to manual mode
            setManualForm(prev => ({
                ...prev,
                questions: [...prev.questions, ...questions]
            }));
            setMode('manual');
        };
        reader.readAsText(csvFile);
    };

    // Simple state for adding/editing a question
    const [editingIndex, setEditingIndex] = useState(-1);
    const [newQ, setNewQ] = useState({ q: '', a: '', b: '', c: '', d: '', correct: '' });

    const handleEditQuestion = (index) => {
        const q = manualForm.questions[index];
        setNewQ({
            q: q.questionText,
            a: q.options[0],
            b: q.options[1],
            c: q.options[2],
            d: q.options[3],
            correct: q.correctAnswer
        });
        setEditingIndex(index);
    };

    const saveQuestion = () => {
        if (!newQ.q || !newQ.correct || !newQ.a || !newQ.b) return alert("Fill question details and select correct answer");

        const questionObj = {
            questionText: newQ.q,
            options: [newQ.a, newQ.b, newQ.c, newQ.d],
            correctAnswer: newQ.correct
        };

        setManualForm(prev => {
            const updatedQuestions = [...prev.questions];
            if (editingIndex >= 0) {
                updatedQuestions[editingIndex] = questionObj;
            } else {
                updatedQuestions.push(questionObj);
            }
            return { ...prev, questions: updatedQuestions };
        });

        // Reset
        setNewQ({ q: '', a: '', b: '', c: '', d: '', correct: '' });
        setEditingIndex(-1);
    };

    // Helper to determine if an option is selected as correct
    const isCorrect = (optionValue) => {
        return newQ.correct === optionValue && optionValue !== '';
    };

    const setCorrectOption = (val) => {
        setNewQ({ ...newQ, correct: val });
    };

    if (fetching) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg">Loading quiz details...</div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{quizId ? 'Edit Quiz' : 'Create New Quiz'}</h2>
                    <Button variant="ghost" size="sm" onClick={onClose}><Icon name="X" /></Button>
                </div>

                {/* Common Settings */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="col-span-3">
                        <Label>Quiz Title <span className="text-red-500">*</span></Label>
                        <Input value={manualForm.title} onChange={e => setManualForm({ ...manualForm, title: e.target.value })} placeholder="e.g. React Fundamentals" />
                    </div>
                    <div>
                        <Label>Time Limit (mins)</Label>
                        <Input type="number" value={manualForm.timeLimit} onChange={e => setManualForm({ ...manualForm, timeLimit: e.target.value })} />
                    </div>
                    <div>
                        <Label>Passing %</Label>
                        <Input type="number" value={manualForm.passingScore} onChange={e => setManualForm({ ...manualForm, passingScore: e.target.value })} />
                    </div>
                </div>

                {mode === 'choice' && (
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setMode('csv')} className="p-8 border-2 border-dashed rounded hover:bg-slate-50 flex flex-col items-center gap-2 group transition-colors hover:border-blue-400">
                            <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200">
                                <Icon name="Upload" size={32} className="text-blue-600" />
                            </div>
                            <span className="font-semibold text-lg">Upload from CSV</span>
                            <span className="text-sm text-slate-500">Bulk import questions</span>
                        </button>
                        <button onClick={() => setMode('manual')} className="p-8 border-2 border-dashed rounded hover:bg-slate-50 flex flex-col items-center gap-2 group transition-colors hover:border-purple-400">
                            <div className="p-4 bg-purple-100 rounded-full group-hover:bg-purple-200">
                                <Icon name="PenTool" size={32} className="text-purple-600" />
                            </div>
                            <span className="font-semibold text-lg">Create Manually</span>
                            <span className="text-sm text-slate-500">Type questions one by one</span>
                        </button>
                    </div>
                )}

                {mode === 'csv' && (
                    <div className="space-y-6">
                        {/* Visual Structure Box */}
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 font-semibold text-slate-700">
                                CSV File Structure
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <div className="min-w-[700px] flex gap-2 text-sm">
                                    <div className="flex-1 bg-slate-100 p-2 rounded text-center border border-slate-300 font-medium">Question Text</div>
                                    <div className="w-24 bg-slate-100 p-2 rounded text-center border border-slate-300 text-slate-500">Option A</div>
                                    <div className="w-24 bg-slate-100 p-2 rounded text-center border border-slate-300 text-slate-500">Option B</div>
                                    {/* ... truncated for check ... */}
                                    <div className="w-32 bg-green-50 p-2 rounded text-center border border-green-200 text-green-700 font-bold">Answer (A/B/C/D)</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded text-blue-800">
                            <span className="text-sm">Need a starting point?</span>
                            <button onClick={downloadTemplate} className="flex items-center gap-1 font-semibold hover:underline">
                                <Icon name="Download" size={16} /> Download Template
                            </button>
                        </div>

                        <div className="space-y-2">
                            <Label>Upload CSV File</Label>
                            <div className="flex gap-2">
                                <Input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setMode('choice')}>Back</Button>
                            <Button onClick={handleCSVUpload} disabled={!csvFile}>Parse & Edit Questions</Button>
                        </div>
                    </div>
                )}

                {mode === 'manual' && (
                    <div className="space-y-6">
                        {/* Edit/Add Question Form */}
                        <div className="border p-4 rounded bg-slate-50 space-y-4">
                            <h3 className="font-semibold text-slate-700">{editingIndex >= 0 ? 'Edit Question' : 'New Question'}</h3>
                            <Input placeholder="Question Text" value={newQ.q} onChange={e => setNewQ({ ...newQ, q: e.target.value })} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Option A', val: newQ.a, key: 'a' },
                                    { label: 'Option B', val: newQ.b, key: 'b' },
                                    { label: 'Option C', val: newQ.c, key: 'c' },
                                    { label: 'Option D', val: newQ.d, key: 'd' }
                                ].map((opt, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div
                                            onClick={() => setCorrectOption(opt.val)}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${isCorrect(opt.val) ? 'border-green-600' : 'border-slate-300'}`}
                                            title="Mark as Correct Answer"
                                        >
                                            {isCorrect(opt.val) && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                                        </div>
                                        <Input
                                            placeholder={opt.label}
                                            value={opt.val}
                                            onChange={e => {
                                                const newVal = e.target.value;
                                                setNewQ(prev => {
                                                    const updated = { ...prev, [opt.key]: newVal };
                                                    // If this was the correct answer, update correct answer text too to keep sync
                                                    if (prev.correct === prev[opt.key]) {
                                                        updated.correct = newVal;
                                                    }
                                                    return updated;
                                                });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {!newQ.correct && <p className="text-xs text-red-500">Please select the correct answer by clicking the radio button next to an option.</p>}

                            <div className="flex justify-end gap-2">
                                {editingIndex >= 0 && <Button variant="ghost" size="sm" onClick={() => { setEditingIndex(-1); setNewQ({ q: '', a: '', b: '', c: '', d: '', correct: '' }); }}>Cancel Edit</Button>}
                                <Button size="sm" onClick={saveQuestion}>{editingIndex >= 0 ? 'Update Question' : 'Add Question'}</Button>
                            </div>
                        </div>

                        {/* List of Questions */}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Questions List ({manualForm.questions.length})</h4>
                            {manualForm.questions.length === 0 && <p className="text-sm text-slate-500 italic">No questions added yet.</p>}

                            {manualForm.questions.map((q, i) => (
                                <div key={i} className={`text-sm p-3 border rounded bg-white flex justify-between items-start ${editingIndex === i ? 'ring-2 ring-blue-500' : ''}`}>
                                    <div className="space-y-1">
                                        <span className="font-medium">{i + 1}. {q.questionText}</span>
                                        <div className="flex gap-2 text-xs text-slate-500">
                                            {q.options.map((opt, idx) => (
                                                <span key={idx} className={q.correctAnswer === opt ? "text-green-600 font-bold" : ""}>
                                                    {['A', 'B', 'C', 'D'][idx]}: {opt}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(i)} title="Edit">
                                            <Icon name="Edit" size={14} className="text-blue-500" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => {
                                            const newQuestions = [...manualForm.questions];
                                            newQuestions.splice(i, 1);
                                            setManualForm(prev => ({ ...prev, questions: newQuestions }));
                                        }} title="Delete">
                                            <Icon name="Trash2" size={14} className="text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t">
                            {!quizId && <Button variant="outline" onClick={() => setMode('choice')}>Back to Options</Button>}
                            <Button onClick={handleCreate} disabled={loading}>{loading ? 'Saving Quiz...' : (quizId ? 'Update Quiz' : 'Create Quiz')}</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;
