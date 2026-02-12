import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: "Free Courses", path: "/courses/free" },
        { name: "Certification", path: "/courses/certification" },
        { name: "Internships", path: "/internships" },
        { name: "Professional", path: "/courses/professional" },
        { name: "About", path: "/about" },
    ];

    return (
        <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src="/logo.jpg" alt="Petluri Edutech" className="h-12 w-auto object-contain" />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-medium text-slate-600 hover:text-brand-blue transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTA & Mobile Menu Toggle */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block">
                        <Link to="/login">
                            <Button variant="default" className="shadow-none">Login</Button>
                        </Link>
                    </div>

                    <button
                        className="md:hidden p-2 text-slate-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-100 bg-white py-4 px-4 flex flex-col gap-4 shadow-lg absolute w-full left-0">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-sm font-medium text-slate-600 py-2 hover:text-brand-blue"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="default" className="w-full">Login</Button>
                    </Link>
                </div>
            )}
        </nav>
    );
};
