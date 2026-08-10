export const APP_NAME = 'StudentOS';
export const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: 'Home' },
  { to: '/learning', label: 'Learning', icon: 'BookOpen' },
  { to: '/placement', label: 'Placement', icon: 'Briefcase' },
  { to: '/community', label: 'Community', icon: 'Users' },
  { to: '/ai', label: 'AI Assistant', icon: 'Bot' },
  { to: '/resume-builder', label: 'Resume Builder', icon: 'FileUser' },
  { to: '/profile', label: 'Profile', icon: 'User' },
  { to: '/settings', label: 'Settings', icon: 'Settings' },
];
export const AI_MODULES = [
  { id: 'mentor', label: 'Academic Mentor', endpoint: '/ai/mentor' },
  { id: 'career', label: 'Career Mentor', endpoint: '/ai/career' },
  { id: 'resume', label: 'Resume Reviewer', endpoint: '/ai/resume' },
  { id: 'english', label: 'English Coach', endpoint: '/ai/english' },
  { id: 'project', label: 'Project Mentor', endpoint: '/ai/project' },
];
