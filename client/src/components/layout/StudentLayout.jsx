import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import { Icon } from '@/components/ui/Icon';

const studentMenuItems = [
    { name: 'Dashboard', path: '/student/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Courses', path: '/student/courses', icon: 'Book' },
    { name: 'Learning', path: '/student/learning', icon: 'PlayCircle' },
    { name: 'Quizzes', path: '/student/quizzes', icon: 'BrainCircuit' },
    { name: 'Certificates', path: '/student/certificates', icon: 'Award' },
    { name: 'Profile', path: '/student/profile', icon: 'User' },
];

const StudentLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar
                menuItems={studentMenuItems}
                title="Fredluri"
                titleSub="STUDENT"
            />

            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30">
                    <h1 className="text-xl font-semibold text-slate-800">Student Portal</h1>
                    <div className="flex items-center gap-4">
                        {/* User Profile Snippet */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-900">John Doe</p>
                                <p className="text-xs text-slate-500">Student</p>
                            </div>
                            <div className="h-10 w-10 bg-brand-blue/10 rounded-full flex items-center justify-center text-brand-blue font-bold">
                                JD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-8">
                    <Breadcrumb />
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
