export const mockDashboard = {
  attendance: 87,
  cgpa: 8.6,
  streak: 12,
  goalsCompleted: 4,
  goalsTotal: 6,
  progress: [
    { day: 'Mon', value: 40 }, { day: 'Tue', value: 55 }, { day: 'Wed', value: 45 },
    { day: 'Thu', value: 70 }, { day: 'Fri', value: 65 }, { day: 'Sat', value: 85 }, { day: 'Sun', value: 90 },
  ],
  attendanceBreakdown: [
    { name: 'Present', value: 87 }, { name: 'Absent', value: 13 },
  ],
  goals: [
    { id: 1, title: 'Complete DBMS revision', done: true },
    { id: 2, title: 'Solve 2 DSA problems', done: true },
    { id: 3, title: 'Watch React architecture lesson', done: true },
    { id: 4, title: 'Apply to 2 internships', done: true },
    { id: 5, title: 'Read OS notes', done: false },
    { id: 6, title: 'Practice English interview', done: false },
  ],
};

export const mockLearning = {
  notes: [
    { id: 1, title: 'DBMS Normalization', description: '1NF, 2NF, 3NF and BCNF quick revision notes.', subject: 'DBMS', type: 'PDF' },
    { id: 2, title: 'Operating Systems', description: 'Processes, threads, scheduling and memory management.', subject: 'OS', type: 'PDF' },
    { id: 3, title: 'React Architecture', description: 'Component design, state, routing and API integration.', subject: 'Web Development', type: 'DOC' },
  ],
  subjects: [
    { id: 1, name: 'Data Structures & Algorithms', progress: 72 },
    { id: 2, name: 'Database Management Systems', progress: 84 },
    { id: 3, name: 'Operating Systems', progress: 61 },
    { id: 4, name: 'Computer Networks', progress: 48 },
  ],
  pyqs: [
    { id: 1, title: 'DBMS End Semester 2025', description: 'University previous year paper', year: 2025 },
    { id: 2, title: 'OS End Semester 2024', description: 'University previous year paper', year: 2024 },
    { id: 3, title: 'CN Mid Semester 2025', description: 'Mid-semester practice paper', year: 2025 },
  ],
  videos: [
    { id: 1, title: 'SQL Joins in 20 minutes', description: 'Fast DBMS revision', duration: '20 min' },
    { id: 2, title: 'Binary Trees', description: 'DSA concept explanation', duration: '34 min' },
    { id: 3, title: 'REST API Design', description: 'Build clean APIs', duration: '28 min' },
  ],
};

export const mockPlacement = {
  companies: [
    { id: 1, name: 'TechNova', industry: 'Software', openings: 12 },
    { id: 2, name: 'CloudBridge', industry: 'Cloud & DevOps', openings: 8 },
    { id: 3, name: 'FinEdge', industry: 'FinTech', openings: 6 },
  ],
  jobs: [
    { id: 1, title: 'Frontend Developer Intern', company: 'TechNova', location: 'Remote', skills: 'React, JavaScript' },
    { id: 2, title: 'Backend Developer Intern', company: 'CloudBridge', location: 'Bengaluru', skills: 'Python, FastAPI' },
    { id: 3, title: 'Software Engineer Trainee', company: 'FinEdge', location: 'Hyderabad', skills: 'Java, SQL' },
  ],
  internships: [
    { id: 1, title: 'Summer Software Internship', company: 'TechNova', duration: '8 weeks' },
    { id: 2, title: 'AI Engineering Internship', company: 'CloudBridge', duration: '12 weeks' },
  ],
};

export const mockPosts = [
  { id: 1, author: 'Aarav', content: 'Anyone preparing DBMS for placements? Let’s share resources.', likes: 18, comments: [{ id: 1, text: 'I have a good normalization sheet.' }] },
  { id: 2, author: 'Meera', content: 'Just completed my first React + FastAPI project! 🚀', likes: 31, comments: [] },
];

export const mockProfile = {
  name: 'Nadz', email: 'student@example.com', college: 'Your College', semester: '6',
  skills: ['React', 'JavaScript', 'Python', 'FastAPI'], bio: 'Computer science student building useful products.',
};

export const mockNotifications = [
  { id: 1, title: 'New internship', message: 'A Frontend Developer internship matches your skills.', read: false, time: '10 min ago' },
  { id: 2, title: 'Daily streak', message: 'You are on a 12-day learning streak. Keep going!', read: false, time: '2 hours ago' },
  { id: 3, title: 'Community reply', message: 'Someone replied to your DBMS discussion.', read: true, time: 'Yesterday' },
];

export const mockAdmin = {
  users: [
    { id: 1, name: 'Aarav', email: 'aarav@example.com', role: 'student', status: 'active' },
    { id: 2, name: 'Meera', email: 'meera@example.com', role: 'student', status: 'active' },
    { id: 3, name: 'Admin', email: 'admin@studentos.local', role: 'admin', status: 'active' },
  ],
  reports: [
    { title: 'Monthly active students', value: '8,240', change: '+12.4%' },
    { title: 'AI conversations', value: '24,680', change: '+18.1%' },
    { title: 'Community posts', value: '4,920', change: '+9.7%' },
  ],
  feedback: [
    { id: 1, student: 'Aarav', message: 'The AI mentor is very helpful.', status: 'new' },
    { id: 2, student: 'Meera', message: 'Please add more PYQs.', status: 'reviewed' },
  ],
};
