import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';

const QuizPage = () => {
    // Mock Quiz Data
    const quiz = {
        title: "Introduction to React - Final Assessment",
        questions: [
            {
                id: 1,
                text: "What is a React Component?",
                options: [
                    "A JavaScript function that accepts inputs and returns a React element",
                    "A database query language",
                    "A server-side routing mechanism",
                    "A CSS preprocessor"
                ]
            },
            {
                id: 2,
                text: "Which hook is used for side effects components?",
                options: [
                    "useState",
                    "useEffect",
                    "useContext",
                    "useReducer"
                ]
            }
        ]
    };

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);

    const progress = ((currentQuestionIdx + 1) / quiz.questions.length) * 100;
    const currentQ = quiz.questions[currentQuestionIdx];

    const handleNext = () => {
        if (currentQuestionIdx < quiz.questions.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedOption(null);
        } else {
            alert("Quiz Completed! (Demo)");
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-xl font-bold text-slate-900">{quiz.title}</h1>
                <div className="flex items-center gap-2 text-red-500 font-mono font-bold bg-red-50 px-3 py-1 rounded">
                    <Icon name="Timer" size={16} /> 10:00
                </div>
            </div>

            <div className="mb-8">
                <div className="flex justify-between text-xs font-semibold mb-2">
                    <span>Question {currentQuestionIdx + 1} of {quiz.questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar value={progress} className="h-2" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg leading-relaxed">
                        {currentQ.text}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {currentQ.options.map((option, idx) => (
                        <div
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedOption === idx
                                    ? 'border-brand-blue bg-blue-50 ring-1 ring-brand-blue'
                                    : 'border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedOption === idx ? 'border-brand-blue' : 'border-slate-300'
                                    }`}>
                                    {selectedOption === idx && <div className="h-2.5 w-2.5 bg-brand-blue rounded-full" />}
                                </div>
                                <span className="text-sm font-medium text-slate-700">{option}</span>
                            </div>
                        </div>
                    ))}
                </CardContent>
                <CardFooter className="justify-end pt-4 border-t border-slate-50">
                    <Button onClick={handleNext} disabled={selectedOption === null}>
                        {currentQuestionIdx === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next Question'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default QuizPage;
