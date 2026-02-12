import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Icon } from '@/components/ui/Icon';
import api from '@/lib/api';

const QuizModal = ({ onClose, onSuccess }) => {
    const [mode, setMode] = useState('choice'); // 'choice', 'manual', 'csv', 'preview'
    const [loading, setLoading] = useState(false);

    // Manual Form State
    const [manualForm, setManualForm] = useState({
        title: '',
        passingScore: 70,
        timeLimit: 30,
        questions: [] // Array of { questionText, options: [], correctAnswer: '' }
    });

    // CSV State
    const [csvFile, setCsvFile] = useState(null);
    const [parsedQuestions, setParsedQuestions] = useState([]);

    // CSV Template
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
            // Handle CSV parsing more robustly if needed (quotes), but simple split for now
            const parts = lines[i].split(',').map(p => p.trim());
            if (parts.length < 6) continue;

            const [qText, optA, optB, optC, optD, correctChar, pts] = parts;
            const options = [optA, optB, optC, optD];

            // Map A/B/C/D to the actual text content
            let correctText = '';
            const correctIndex = map[correctChar];
            if (correctIndex !== undefined && options[correctIndex]) {
                correctText = options[correctIndex];
            } else {
                // Fallback: assume they might have typed the text directly or it's invalid
                correctText = correctChar;
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

    const handleCreate = async (questionsToSubmit) => {
        if (!manualForm.title) {
            alert("Please enter a quiz title");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                title: manualForm.title,
                passingScore: Number(manualForm.passingScore),
                timeLimit: Number(manualForm.timeLimit),
                questions: questionsToSubmit,
                courseId: null // Optional as per backend update
            };

            const res = await api.post('/admin/create-quiz', payload);
            onSuccess(res.data);
            onClose();
        } catch (error) {
            console.error("Quiz creation failed", error);
            alert("Failed to create quiz: " + (error.response?.data?.message || error.message));
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

            setParsedQuestions(questions);
            setMode('preview');
        };
        reader.readAsText(csvFile);
    };

    const handleManualSubmit = () => {
        if (manualForm.questions.length === 0) {
            alert("Please add at least one question.");
            return;
        }
        handleCreate(manualForm.questions);
    };

    // Simple state for adding a manual question
    const [newQ, setNewQ] = useState({ q: '', a: '', b: '', c: '', d: '', correct: '' });
    const addManualQuestion = () => {
        if (!newQ.q || !newQ.correct || !newQ.a) return alert("Fill question details");
        setManualForm(prev => ({
            ...prev,
            questions: [...prev.questions, {
                questionText: newQ.q,
                options: [newQ.a, newQ.b, newQ.c, newQ.d],
                correctAnswer: newQ.correct
            }]
        }));
        setNewQ({ q: '', a: '', b: '', c: '', d: '', correct: '' });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Create New Quiz</h2>
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
                                    <div className="w-24 bg-slate-100 p-2 rounded text-center border border-slate-300 text-slate-500">Option C</div>
                                    <div className="w-24 bg-slate-100 p-2 rounded text-center border border-slate-300 text-slate-500">Option D</div>
                                    <div className="w-32 bg-green-50 p-2 rounded text-center border border-green-200 text-green-700 font-bold">Answer (A/B/C/D)</div>
                                    <div className="w-16 bg-slate-100 p-2 rounded text-center border border-slate-300 text-slate-500">Points</div>
                                </div>
                                <div className="min-w-[700px] flex gap-2 mt-2 text-sm opacity-60">
                                    <div className="flex-1 p-2 text-center">What is X?</div>
                                    <div className="w-24 p-2 text-center">Ans 1</div>
                                    <div className="w-24 p-2 text-center">Ans 2</div>
                                    <div className="w-24 p-2 text-center">Ans 3</div>
                                    <div className="w-24 p-2 text-center">Ans 4</div>
                                    <div className="w-32 p-2 text-center font-bold">A</div>
                                    <div className="w-16 p-2 text-center">1</div>
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
                            <Button onClick={handleCSVUpload} disabled={!csvFile}>Preview Questions</Button>
                        </div>
                    </div>
                )}

                {mode === 'preview' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg">Preview Questions ({parsedQuestions.length})</h3>
                            <div className="text-sm text-slate-500">Check correct answers</div>
                        </div>

                        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                            {parsedQuestions.map((q, i) => (
                                <div key={i} className="border p-4 rounded bg-slate-50">
                                    <p className="font-semibold mb-3">{i + 1}. {q.questionText}</p>
                                    <div className="space-y-2">
                                        {q.options.map((opt, optIndex) => {
                                            const isCorrect = opt === q.correctAnswer;
                                            return (
                                                <div key={optIndex} className={`flex items-center gap-3 p-2 rounded ${isCorrect ? 'bg-green-100 border border-green-200' : 'bg-white border border-slate-200'}`}>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCorrect ? 'border-green-600' : 'border-slate-300'}`}>
                                                        {isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-green-600" />}
                                                    </div>
                                                    <span className={isCorrect ? 'font-medium text-green-900' : 'text-slate-700'}>{opt}</span>
                                                    {isCorrect && <span className="ml-auto text-xs font-bold text-green-600 px-2 py-0.5 bg-green-200 rounded">CORRECT</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setMode('csv')}>Back to Upload</Button>
                            <Button onClick={() => handleCreate(parsedQuestions)} disabled={loading}>
                                {loading ? 'Creating Quiz...' : 'Confirm & Create Quiz'}
                            </Button>
                        </div>
                    </div>
                )}

                {mode === 'manual' && (
                    <div className="space-y-6">
                        <div className="border p-4 rounded bg-slate-50 space-y-3">
                            <Label>New Question</Label>
                            <Input placeholder="Question Text" value={newQ.q} onChange={e => setNewQ({ ...newQ, q: e.target.value })} />
                            <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Option A" value={newQ.a} onChange={e => setNewQ({ ...newQ, a: e.target.value })} />
                                <Input placeholder="Option B" value={newQ.b} onChange={e => setNewQ({ ...newQ, b: e.target.value })} />
                                <Input placeholder="Option C" value={newQ.c} onChange={e => setNewQ({ ...newQ, c: e.target.value })} />
                                <Input placeholder="Option D" value={newQ.d} onChange={e => setNewQ({ ...newQ, d: e.target.value })} />
                            </div>
                            <Input placeholder="Correct Answer (Exact String)" value={newQ.correct} onChange={e => setNewQ({ ...newQ, correct: e.target.value })} />
                            <Button size="sm" onClick={addManualQuestion}>Add Question</Button>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-semibold">Questions ({manualForm.questions.length})</h4>
                            {manualForm.questions.map((q, i) => (
                                <div key={i} className="text-sm p-2 border rounded bg-white">
                                    <span className="font-medium">{i + 1}. {q.questionText}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setMode('choice')}>Back</Button>
                            <Button onClick={handleManualSubmit} disabled={loading}>{loading ? 'Creating...' : 'Create Quiz'}</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuizModal;
