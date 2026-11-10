// Who I am. The hero, About, Contact, footer and command menu all read from here,
// so this is the one file to edit when the résumé changes.

export const profile = {
    firstName: 'Ankit',
    lastName: 'Kumar',
    name: 'Ankit Kumar',
    initials: 'AK',
    headline: 'B.Tech CSE (AI) student and aspiring software engineer',
    location: 'Pune, India',
    status: 'Open to internships',
    email: 'ankitkumar17541@gmail.com',
    // The PDF lives in public/. Replace that file to update the download.
    resumeUrl: `${import.meta.env.BASE_URL}Ankit_Kumar_Resume.pdf`,
    links: {
        github: 'https://github.com/Ironankit525',
        linkedin: 'https://www.linkedin.com/in/ankit-kumar525/',
    },

    // Hero
    typedRoles: ['full-stack web apps', 'AI media pipelines', 'computer-vision apps', 'open-source fixes'],
    intro: 'Second-year B.Tech CSE (AI) student in Pune. I build full-stack web apps, mobile apps and automated media pipelines, and I like understanding how things work under the hood.',
    badge: 'B.Tech CSE (AI) · 2nd year',

    // About
    about: [
        'I’m Ankit, a second-year B.Tech Computer Science student specialising in Artificial Intelligence at Vedam School of Technology, Ajeenkya DY Patil University, Pune.',
        'I build full-stack web applications, mobile apps and automated media pipelines, and I contribute bug fixes, features and documentation to open-source projects.',
        'From automation workflows to backend architecture, I care about clean code, thoughtful interfaces and understanding how things actually work.',
    ],
    focus: ['AI systems', 'Full-stack development', 'Systems programming', 'Open source'],
    lookingFor: 'Internships where I can apply AI, full-stack development and systems programming in production.',
    goals: ['Google Summer of Code (GSoC)', 'LFX Mentorship'],
    exploring: ['Cybersecurity basics', 'Backend systems design', 'GC-aware memory management', 'Golang'],
    education: [
        {
            period: '2025 — Present',
            title: 'B.Tech, Computer Science Engineering',
            detail: 'Specialisation in Artificial Intelligence · 2nd year',
            place: 'Vedam School of Technology, Ajeenkya DY Patil University · Pune, Maharashtra',
            coursework: ['AI Foundations', 'Data Structures', 'OOP', 'Database Management'],
        },
        {
            period: '2023 — 2025',
            title: '12th Standard',
            place: 'St. Karen’s Secondary School',
        },
    ],
};

// The sections linked from the navigation and the command menu, in page order.
export const sections = [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Work' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'contact', label: 'Contact' },
];
