import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';

const LiveBoard = ({ stats }) => {
    // stats: { totalActiveCourses, totalHours, enrollmentStats: { free, certification, professional, internship } }

    return (
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Live Board</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                        <Icon name="BookOpen" className="text-blue-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-slate-900">{stats.totalActiveCourses || 0}</span>
                        <span className="text-xs text-slate-500">Active Courses</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                        <Icon name="Clock" className="text-orange-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-slate-900">{stats.totalHours || 0}h</span>
                        <span className="text-xs text-slate-500">Video Content</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                        <Icon name="Award" className="text-purple-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-slate-900">{stats.enrollmentStats?.certification || 0}</span>
                        <span className="text-xs text-slate-500">Certifications</span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-lg">
                        <Icon name="Briefcase" className="text-green-500 mb-2" size={24} />
                        <span className="text-2xl font-bold text-slate-900">{stats.enrollmentStats?.internship || 0}</span>
                        <span className="text-xs text-slate-500">Interns</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LiveBoard;
