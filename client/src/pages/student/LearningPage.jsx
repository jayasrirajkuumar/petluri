import React, { useState } from 'react';
import { VideoCard } from '@/components/cards/VideoCard';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

const LearningPage = () => {
    const [activeVideoId, setActiveVideoId] = useState(1);

    const playlist = [
        { id: 1, title: "1. Introduction to React", duration: "10:00", isCompleted: true, isLocked: false },
        { id: 2, title: "2. Setting up Vite", duration: "15:30", isCompleted: false, isLocked: false },
        { id: 3, title: "3. Component Architecture", duration: "20:00", isCompleted: false, isLocked: true },
        { id: 4, title: "4. State & Props", duration: "18:45", isCompleted: false, isLocked: true },
        { id: 5, title: "5. Hooks Explained", duration: "25:00", isCompleted: false, isLocked: true },
    ];

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
            {/* Left Panel: Video Player */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative flex items-center justify-center">
                    {/* Placeholder Player */}
                    <div className="text-white text-center">
                        <Icon name="PlayCircle" size="2xl" className="mx-auto mb-4 opacity-50" />
                        <p>Video Player Placeholder</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">{playlist.find(v => v.id === activeVideoId)?.title}</h1>
                    <p className="text-slate-500">Full Stack Web Development</p>

                    <div className="mt-6 border-b border-slate-200">
                        <Tabs defaultValue="overview">
                            <TabsList>
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="notes">Notes</TabsTrigger>
                                <TabsTrigger value="resources">Resources</TabsTrigger>
                            </TabsList>
                            <TabsContent value="overview" className="py-4 text-slate-600">
                                In this lesson, we will cover the fundamentals of React JS and how it differs from traditional HTML/JS development.
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Right Panel: Playlist */}
            <div className="w-full lg:w-96 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-900">Course Content</h3>
                    <span className="text-xs text-slate-500">35% Completed</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {playlist.map((video) => (
                        <VideoCard
                            key={video.id}
                            {...video}
                            isActive={video.id === activeVideoId}
                            onClick={() => setActiveVideoId(video.id)}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <Button className="w-full">Next Lesson <Icon name="ChevronRight" size={14} className="ml-2" /></Button>
                </div>
            </div>
        </div>
    );
};

export default LearningPage;
