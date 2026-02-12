import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';

const QuizCard = ({ title, questionsMs, durationMs, status, onStart }) => {
    // Status: 'pending', 'completed', 'failed'

    const statusMap = {
        pending: { label: 'Pending', variant: 'secondary' },
        completed: { label: 'Passed', variant: 'success' },
        failed: { label: 'Failed', variant: 'destructive' }
    };

    const currentStatus = statusMap[status] || statusMap.pending;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start mb-2">
                    <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600">
                        <Icon name="BrainCircuit" size="md" />
                    </div>
                    <Badge variant={currentStatus.variant}>{currentStatus.label}</Badge>
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>

            <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Icon name="HelpCircle" size={14} /> {questionsMs} Qs</span>
                    <span className="flex items-center gap-1"><Icon name="Clock" size={14} /> {durationMs}</span>
                </div>
            </CardContent>

            <CardFooter className="pt-2">
                <Button
                    className="w-full"
                    variant={status === 'completed' ? 'outline' : 'default'}
                    disabled={status === 'completed'}
                    onClick={onStart}
                >
                    {status === 'completed' ? 'Review Result' : 'Start Quiz'}
                </Button>
            </CardFooter>
        </Card>
    );
};

export { QuizCard };
