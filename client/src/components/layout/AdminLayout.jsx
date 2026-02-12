import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';

const adminMenuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'LayoutDashboard' },
    { name: 'Programs', path: '/admin/programs', icon: 'LayoutList' },
    { name: 'Invite', path: '/admin/students', icon: 'UserPlus' },
    { name: 'Enrollments', path: '/admin/enrollments', icon: 'CreditCard' },
    { name: 'Quizzes', path: '/admin/quizzes', icon: 'BrainCircuit' },
    { name: 'Certificates', path: '/admin/certificates', icon: 'Award' },
    { name: 'Reports', path: '/admin/reports', icon: 'BarChart3' },
    { name: 'Settings', path: '/admin/settings', icon: 'Settings' },
];

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar
                menuItems={adminMenuItems}
                title=" Fredluri"
                titleSub="ADMIN"
                logoHref="/admin/dashboard"
            />

            <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
                {/* Admin Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-30 shadow-sm">
                    <h1 className="text-xl font-bold text-slate-900">Admin Console</h1>
                    <div className="flex items-center gap-4">
                        {/* Admin Profile Snippet */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-slate-900">Admin User</p>
                                <p className="text-xs text-slate-500">Super Admin</p>
                            </div>
                            <div className="h-10 w-10 bg-brand-yellow/20 rounded-full flex items-center justify-center text-brand-yellow font-bold border border-brand-yellow/50">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-8 bg-slate-50/50">
                    <Breadcrumb />
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
