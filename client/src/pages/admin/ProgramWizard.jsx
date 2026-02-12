import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TextArea } from '@/components/ui/TextArea';
import { Icon } from '@/components/ui/Icon';
import { Label } from '@/components/ui/Label';
import api from '@/lib/api';
import ModuleEditor from '@/components/admin/ModuleEditor';
import { useNavigate, useParams } from 'react-router-dom';

const ProgramWizard = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get course ID from URL
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [quizzes, setQuizzes] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'certification',
        level: 'Beginner',
        duration: '',
        price: '',
        programCode: '', // READ ONLY
        image: '', // Course Banner URL
        modules: [{ title: 'Introduction', content: [] }], // Default module
        isPublished: false
    });

    // Fetch Course Data for Edit Mode
    useEffect(() => {
        const fetchCourseData = async () => {
            if (!id) return; // Only fetch if in edit mode

            try {
                setLoading(true);
                const res = await api.get(`/admin/courses/${id}`);
                const course = res.data;

                // Populate form data
                setFormData({
                    title: course.title || '',
                    description: course.description || '',
                    type: course.type || 'certification',
                    level: course.level || 'Beginner',
                    duration: course.duration || '',
                    price: course.price || '',
                    programCode: course.programCode || '',
                    image: course.image || '',
                    modules: course.modules || [],
                    isPublished: course.isPublished || false
                });
            } catch (error) {
                console.error("Failed to fetch course details", error);
                alert("Failed to load course details.");
                navigate('/admin/programs');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, navigate]);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await api.get('/admin/quizzes');
                setQuizzes(res.data);
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            }
        };
        fetchQuizzes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleValueChange = (name, value) => {
        setFormData(prev => {
            const updates = { [name]: value };
            if (name === 'type' && value === 'free') {
                updates.price = 0;
            }
            return { ...prev, ...updates };
        });
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Use the mock upload endpoint
            const data = { filename: file.name, type: 'image' };
            const response = await api.post('/admin/upload-video', data);
            setFormData(prev => ({ ...prev, image: response.data.url }));
        } catch (error) {
            console.error("Image upload failed", error);
        }
    };

    const steps = ['Program Details', 'Curriculum & Content', 'Settings & Config', 'Preview & Publish'];

    const handleNext = () => {
        if (currentStep === 0) {
            if (!formData.title || !formData.description || !formData.type || !formData.level || !formData.duration) {
                alert("Please fill in all required fields.");
                return;
            }
            if (formData.type !== 'free' && (!formData.price || Number(formData.price) <= 0)) {
                alert("Price is required for paid programs.");
                return;
            }
        }
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };
    const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const handleSubmit = async () => {
        setLoading(true);

        // Sanitize Data
        // Sanitize Data
        const sanitizedData = { ...formData };

        // Validation
        if (!sanitizedData.title || !sanitizedData.description || !sanitizedData.type || !sanitizedData.level || !sanitizedData.duration) {
            alert("Please fill in all required fields (Title, Description, Type, Level, Duration).");
            setLoading(false);
            return;
        }

        if (sanitizedData.type !== 'free' && (!sanitizedData.price || Number(sanitizedData.price) <= 0)) {
            alert("Price is required for paid programs.");
            setLoading(false);
            return;
        }

        // Validate Modules
        if (sanitizedData.modules.length === 0) {
            alert("Please add at least one module.");
            setLoading(false);
            return;
        }

        for (let i = 0; i < sanitizedData.modules.length; i++) {
            const m = sanitizedData.modules[i];
            if (!m.title || !m.description) {
                alert(`Please fill in Name and Description for Module ${i + 1}`);
                setLoading(false);
                return;
            }
        }

        // 1. Handle Price
        if (!sanitizedData.price || isNaN(sanitizedData.price)) {
            sanitizedData.price = 0;
        } else {
            sanitizedData.price = Number(sanitizedData.price);
        }

        // 2. Handle Modules (QuizId)
        sanitizedData.modules = sanitizedData.modules.map(module => ({
            ...module,
            content: module.content.map(item => {
                const cleanItem = { ...item };
                if (cleanItem.type === 'quiz' && (!cleanItem.quizId || cleanItem.quizId === "")) {
                    delete cleanItem.quizId; // Remove if empty to avoid CastError
                }
                if (cleanItem.type === 'video') {
                    delete cleanItem.quizId; // Videos don't need quizId
                }
                return cleanItem;
            })
        }));

        try {
            if (id) {
                // Update existing course
                await api.put(`/admin/courses/${id}`, sanitizedData);
                alert("Program updated successfully!");
            } else {
                // Create new course
                await api.post('/admin/courses', sanitizedData);
                alert("Program created successfully!");
            }
            navigate('/admin/programs');
        } catch (error) {
            console.error("Failed to save program", error, error.response?.data);
            alert(`Failed to save program: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{id ? 'Edit Program Details' : 'New Program Details'}</h2>
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Program Title <span className="text-red-500">*</span></Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Full Stack Web Development" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <TextArea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detailed description..." className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Course Banner Image</Label>
                <div className="flex gap-4 items-center">
                    <Input id="image" type="file" onChange={handleImageUpload} accept="image/*" className="max-w-md" />
                    {formData.image && (
                        <div className="relative h-20 w-32 rounded overflow-hidden border border-slate-200">
                            <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                </div>
            </div>

            {id && (
                <div className="space-y-2">
                    <Label>Program Code (Auto-generated)</Label>
                    <Input value={formData.programCode} disabled className="bg-slate-100" />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Program Type <span className="text-red-500">*</span></Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        value={formData.type}
                        onChange={(e) => handleValueChange('type', e.target.value)}
                    >
                        <option value="free">Free Course</option>
                        <option value="certification">Certification Program</option>
                        <option value="professional">Professional Masterclass</option>
                        <option value="internship">Internship Program</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Difficulty Level <span className="text-red-500">*</span></Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                        value={formData.level}
                        onChange={(e) => handleValueChange('level', e.target.value)}
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="duration">Duration <span className="text-red-500">*</span></Label>
                    <Input id="duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 40 Hours" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="price">Price (₹) {formData.type !== 'free' && <span className="text-red-500">*</span>}</Label>
                    <Input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder={formData.type === 'free' ? "Free" : "e.g., 4999"}
                        disabled={formData.type === 'free'}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 text-sm text-blue-700">
                <Icon name="Info" size={20} className="mt-0.5 shrink-0" />
                <p>Organize your course into modules. You can add videos (upload) and quizzes (select existing) to each module.</p>
            </div>

            <ModuleEditor
                modules={formData.modules}
                setModules={(newModules) => handleValueChange('modules', newModules)}
                quizzes={quizzes}
                onQuizCreated={(newQuiz) => setQuizzes(prev => [...prev, newQuiz])}
            />
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-slate-50 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-yellow-100 p-2 rounded text-yellow-700">
                        <Icon name="Award" size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">Completion Certificate</h3>
                        <p className="text-xs text-slate-500">Optional: Configure certificate settings</p>
                    </div>
                </div>

                <Label>Certificate Template</Label>
                <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                >
                    <option value="">Select Template (Optional)</option>
                    <option value="standard">Standard Completion</option>
                    <option value="merit">Merit Certificate</option>
                </select>
            </div>

            {formData.type === 'internship' && (
                <div className="border rounded-lg p-6 bg-slate-50 space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-blue-100 p-2 rounded text-blue-700">
                            <Icon name="FileText" size={24} />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Offer Letter</h3>
                            <p className="text-xs text-slate-500">Sent automatically upon enrollment for internships</p>
                        </div>
                    </div>

                    <Label>Offer Letter Template</Label>
                    <select
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                    >
                        <option value="">Select Template</option>
                        <option value="std_intern">Standard Internship Offer</option>
                        <option value="se_intern">Software Engineering Intern</option>
                    </select>
                </div>
            )}
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-6">
            <div className="text-center py-6">
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                    <Icon name="CheckCircle" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to Publish!</h3>
                <p className="text-slate-500 max-w-md mx-auto">Please review the details below before making this program live.</p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-slate-500 block">Title</span>
                        <span className="font-medium text-slate-900">{formData.title}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block">Type</span>
                        <span className="font-medium text-slate-900 capitalize">{formData.type}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block">Duration</span>
                        <span className="font-medium text-slate-900">{formData.duration}</span>
                    </div>
                    <div>
                        <span className="text-slate-500 block">Modules</span>
                        <span className="font-medium text-slate-900">{formData.modules.length} Modules</span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Create New Program</h1>
                <Button variant="outline" onClick={() => navigate('/admin/programs')}>Cancel</Button>
            </div>

            {/* Stepper */}
            <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 -z-10" />
                <div className="flex justify-between">
                    {steps.map((stepLabel, idx) => {
                        const isCompleted = idx < currentStep;
                        const isActive = idx === currentStep;
                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 bg-white px-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${isCompleted ? 'bg-green-500 text-white' :
                                    isActive ? 'bg-brand-blue text-white ring-4 ring-blue-50' :
                                        'bg-slate-100 text-slate-400'
                                    }`}>
                                    {isCompleted ? <Icon name="Check" size={14} /> : idx + 1}
                                </div>
                                <span className={`text-xs font-medium ${isActive ? 'text-brand-blue' : 'text-slate-500'}`}>{stepLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>{steps[currentStep]}</CardTitle>
                </CardHeader>
                <CardContent>
                    {currentStep === 0 && renderStep1()}
                    {currentStep === 1 && renderStep2()}
                    {currentStep === 2 && renderStep3()}
                    {currentStep === 3 && renderStep4()}
                </CardContent>
            </Card>

            <div className="flex justify-between">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>Previous</Button>
                {currentStep === steps.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? 'Publishing...' : 'Publish Program'}
                    </Button>
                ) : (
                    <Button onClick={handleNext}>Next Step</Button>
                )}
            </div>
        </div>
    );
};

export default ProgramWizard;
