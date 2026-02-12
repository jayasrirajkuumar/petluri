import React from 'react';
import { StatCard } from '@/components/cards/StatCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { Button } from '@/components/ui/Button';

const StudentDashboard = () => {
    // Mock Data
    const stats = [
        { title: 'Enrolled Courses', value: 3, icon: 'BookOpen', trend: 0 },
        { title: 'Completed', value: 1, icon: 'CheckCircle', trend: 0 },
        { title: 'Certificates', value: 1, icon: 'Award', trend: 0 },
        { title: 'Pending Quizzes', value: 2, icon: 'Brain', trend: 0 },
    ];

    const activeCourses = [
        {
            id: 1,
            title: 'Full Stack Web Development',
            description: 'Modules completed: 4/12',
            duration: '60h',
            level: 'Advanced',
            image: '',
            price: 'In Progress', // Using price prop for status
            progress: 35
        },
        {
            id: 2,
            title: 'Digital Marketing Basics',
            description: 'Modules completed: 2/5',
            duration: '2h 15m',
            level: 'Beginner',
            image: '',
            price: 'In Progress',
            progress: 40
        }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Welcome back, John! 👋</h2>
                <p className="text-slate-500">Pick up where you left off.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} className="border-none shadow-md" />
                ))}
            </div>

            {/* Continue Learning */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Continue Learning</h3>
                    <Button variant="link">View All Courses</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCourses.map((course) => (
                        <div key={course.id} className="h-full">
                            <CourseCard course={course} type="free" /> {/* Reusing type 'free' style for simplicity or create new 'enrolled' style */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
