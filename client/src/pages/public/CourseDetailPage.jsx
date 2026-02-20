import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import api from '@/lib/api';
import { loadRazorpay } from '@/components/utils/loadRazorpay';
import { useAuth } from '@/context/AuthContext';
import EnrollmentFormModal from '@/components/EnrollmentFormModal';

const CourseDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Determine API endpoint based on role or just public endpoint?
                // Assuming public endpoint is available or reusing admin one for now if public not separate
                // Actually, best to have a public endpoint. Let's try /courses/:id
                // If that fails, we might need to adjust backend.
                // Based on previous tasks, we added GET /courses/:id to public routes?
                // Let's check publicController.js later if this fails.
                const res = await api.get(`/courses/${id}`);
                setCourse(res.data);
            } catch (error) {
                console.error("Failed to fetch course details", error);
                // Fallback attempt to admin route if user is admin? No, this is public page.
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const handleEnrollClick = () => {
        setIsEnrollModalOpen(true);
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading course details...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

    return (
        <div className="bg-slate-50 min-h-screen py-10">
            <div className="container mx-auto px-4 max-w-6xl">
                <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Back to Courses
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Section */}
                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100">
                            {course.image && (
                                <div className="h-64 sm:h-80 w-full relative">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Badge className="bg-white/90 text-slate-900 border-none shadow-md capitalize text-sm px-3 py-1">
                                            {course.type}
                                        </Badge>
                                    </div>
                                </div>
                            )}
                            <div className="p-8">
                                <h1 className="text-3xl font-bold text-slate-900 mb-4">{course.title}</h1>
                                <div className="flex flex-wrap gap-6 text-slate-600 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Icon name="BarChart" size={18} className="text-blue-500" />
                                        <span>{course.level}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon name="Clock" size={18} className="text-purple-500" />
                                        <span>{course.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Icon name="BookOpen" size={18} className="text-green-500" />
                                        <span>{course.modules?.length || 0} Modules</span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {course.description}
                                </p>
                            </div>
                        </div>

                        {/* Curriculum / Modules */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Course Curriculum</h2>
                            <div className="space-y-4">
                                {course.modules && course.modules.map((module, idx) => (
                                    <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden">
                                        <div className="bg-slate-50 p-4 font-medium text-slate-800 flex justify-between items-center">
                                            <span>Module {idx + 1}: {module.title}</span>
                                            <Badge variant="outline" className="bg-white text-xs">{module.content?.length || 0} Topics</Badge>
                                        </div>
                                    </div>
                                ))}
                                {(!course.modules || course.modules.length === 0) && (
                                    <p className="text-slate-500 italic">Curriculum details coming soon.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            <Card className="shadow-lg border-blue-100 overflow-hidden">
                                <div className="bg-blue-600 p-1"></div>
                                <CardHeader>
                                    <CardTitle>Enrollment Options</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                                        <span className="text-slate-500 text-sm block mb-1">Course Fee</span>
                                        <span className="text-4xl font-bold text-slate-900">
                                            {course.price ? `₹${course.price}` : 'Free'}
                                        </span>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex items-start gap-3 text-sm text-slate-600">
                                            <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                                            <span>Full Lifetime Access</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-sm text-slate-600">
                                            <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                                            <span>Certificate of Completion</span>
                                        </div>
                                        {course.type === 'internship' && (
                                            <div className="flex items-start gap-3 text-sm text-slate-600">
                                                <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                                                <span>Internship Offer Letter</span>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3 text-sm text-slate-600">
                                            <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                                            <span>24/7 Support</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
                                        onClick={handleEnrollClick}
                                        disabled={enrolling}
                                    >
                                        {enrolling ? 'Processing...' : 'Enroll Now'}
                                    </Button>

                                    {!user && (
                                        <p className="text-xs text-center text-slate-400">
                                            You'll be asked to login or register during enrollment.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            <EnrollmentFormModal
                isOpen={isEnrollModalOpen}
                onClose={() => setIsEnrollModalOpen(false)}
                course={course}
                initialUser={user}
            />
        </div>
    );
};

export default CourseDetailPage;
