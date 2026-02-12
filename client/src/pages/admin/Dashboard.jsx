import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/cards/StatCard';
import LiveBoard from '@/components/dashboard/LiveBoard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/lib/api';
import { Icon } from '@/components/ui/Icon';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalEnrollments: 0,
        enrollmentStats: {},
        totalActiveCourses: 0,
        totalHours: 0,
        topCourses: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: 'Users',
            onClick: () => navigate('/admin/students')
        },
        {
            title: 'Total Enrollments',
            value: stats.totalEnrollments,
            icon: 'GraduationCap',
            onClick: () => navigate('/admin/enrollments')
        },
        {
            title: 'Active Programs',
            value: stats.totalActiveCourses,
            icon: 'BookOpen',
            onClick: () => navigate('/admin/programs')
        },
        {
            title: 'Draft Programs',
            value: stats.totalDraftCourses || 0,
            icon: 'FileEdit',
            onClick: () => navigate('/admin/programs')
        },
    ];

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-sm text-slate-500">Overview of your platform's performance.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        {...stat}
                        className="shadow-sm border border-slate-200"
                    />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Live Board (2 Columns) */}
                <LiveBoard stats={stats} />

                {/* Top Courses (1 Column) */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Top Courses</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topCourses && stats.topCourses.length > 0 ? (
                                stats.topCourses.map((course, idx) => (
                                    <div key={idx} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="h-8 w-8 min-w-[2rem] rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-brand-blue">
                                                {idx + 1}
                                            </div>
                                            <p className="text-sm font-medium text-slate-900 truncate" title={course.title}>
                                                {course.title}
                                            </p>
                                        </div>
                                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                                            {course.count}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
