import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const ProfilePage = () => {
    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-slate-900 mb-8">My Profile</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">First Name</label>
                            <Input defaultValue="John" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <Input defaultValue="Doe" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email Address</label>
                        <Input defaultValue="student@email.com" disabled />
                    </div>
                    <Button className="mt-4">Update Profile</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
