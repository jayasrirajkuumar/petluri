
export const PROGRAM_TYPES = {
    INTERNSHIP: 'Internship',
    FREE_COURSE: 'Free Course',
    CERTIFICATION: 'Certification Course',
    PROFESSIONAL: 'Professional Course'
};

export const PROGRAM_STYLES = {
    [PROGRAM_TYPES.INTERNSHIP]: {
        color: 'purple',
        gradient: 'from-purple-800 to-purple-600',
        bg: 'bg-purple-50',
        text: 'text-purple-700',
        border: 'border-purple-200',
        badge: 'Career Launchpad',
        icon: 'Briefcase'
    },
    [PROGRAM_TYPES.FREE_COURSE]: {
        color: 'blue',
        gradient: 'from-blue-700 to-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        badge: 'Community Access',
        icon: 'BookOpen'
    },
    [PROGRAM_TYPES.CERTIFICATION]: {
        color: 'green',
        gradient: 'from-emerald-700 to-emerald-500',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'Verified Skills',
        icon: 'Award'
    },
    [PROGRAM_TYPES.PROFESSIONAL]: {
        color: 'slate',
        gradient: 'from-slate-900 to-slate-700',
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        badge: 'Career Pro',
        icon: 'TrendingUp'
    }
};
