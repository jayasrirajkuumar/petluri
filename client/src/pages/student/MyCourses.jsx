import React from 'react';
import { CourseCard } from '@/components/cards/CourseCard';
import { ProgressBar } from '@/components/ui/ProgressBar';

const MyCourses = () => {
    const courses = [
        {
            id: 1,
            title: 'Full Stack Web Development',
            description: 'Next Lesson: React Hooks',
            duration: '60h',
            level: 'Advanced',
            image: '',
            price: '', // Hide price
            progress: 35
        },
        // ... more courses
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-8">My Enrolled Courses</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="relative group">
                        <CourseCard course={course} type="free" />
                        <div className="absolute bottom-16 left-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg border border-slate-100 shadow-sm">
                            <div className="flex justify-between text-xs font-semibold mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                            </div>
                            <ProgressBar value={course.progress} className="h-1.5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;
