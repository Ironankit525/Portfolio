import armCover from '../assets/Screenshot 2026-03-06 at 5.57.37 AM.webp';
import calendarCover from '../assets/Screenshot 2026-05-06 at 11.54.29 PM.png';
import markerCover from '../assets/ChatGPT Image May 7, 2026 at 12_19_54 AM.png';
import arm1 from '../assets/Screenshot 2026-03-06 at 5.55.29 AM.webp';
import arm2 from '../assets/Screenshot 2026-03-06 at 5.55.41 AM.webp';
import arm3 from '../assets/Screenshot 2026-03-06 at 5.56.15 AM.webp';
import arm4 from '../assets/Screenshot 2026-03-06 at 5.56.26 AM.webp';
import arm5 from '../assets/Screenshot 2026-03-06 at 5.56.46 AM.webp';
import arm7 from '../assets/Screenshot 2026-03-06 at 5.57.48 AM.webp';
import arm8 from '../assets/Screenshot 2026-03-06 at 5.57.58 AM.webp';
import calendar2 from '../assets/Screenshot 2026-05-06 at 11.55.04 PM.png';
import calendar3 from '../assets/Screenshot 2026-05-06 at 11.55.43 PM.png';
import marker1 from '../assets/Screenshot_20260507_001110.jpg';
import marker2 from '../assets/Screenshot_20260507_001040.jpg';
import marker3 from '../assets/Screenshot_20260507_001033.jpg';

// Add a record here. Cards, filters, and detail galleries update automatically.
// Order controls display order; the first project is the larger featured card.
// gallery, githubUrl, liveUrl, and slug are optional. See README for an example.
export const projects = [
    {
        id: 'arm-ecommerce',
        title: 'ARM E-Commerce Platform',
        category: 'Web',
        description: 'A full-stack e-commerce platform with product management, authentication, and a scalable backend.',
        image: armCover,
        imageAlt: 'ARM Gear dashboard with revenue, sales, and inventory analytics',
        tags: ['React', 'Node.js', 'Full-stack'],
        githubUrl: 'https://github.com/Ironankit525/ARM.git',
        liveUrl: 'https://armgear.vercel.app',
        gallery: [arm1, arm2, arm3, arm4, arm5, armCover, arm7, arm8],
    },
    {
        id: 'calendar-component',
        slug: 'calendar', // Keeps existing shared project links working.
        title: 'Calendar Component',
        category: 'Web',
        description: 'An interactive calendar with a thoughtful interface for desktop and mobile.',
        image: calendarCover,
        imageAlt: 'Calendar component showing a monthly view beside a photograph of flowers',
        tags: ['React', 'UI/UX', 'Responsive'],
        githubUrl: 'https://github.com/Ironankit525/Calander_component.git',
        liveUrl: 'https://calander-component.vercel.app',
        gallery: [calendarCover, calendar2, calendar3],
    },
    {
        id: 'marker-app',
        title: 'Custom Marker Detection',
        category: 'Mobile',
        description: 'An Android app that detects, isolates, and extracts visual markers using the device camera.',
        image: markerCover,
        imageAlt: 'Custom marker detection app preview with a phone scanning a visual marker',
        tags: ['React Native', 'Android', 'Computer vision'],
        githubUrl: 'https://github.com/Ironankit525/Marker-detection-app.git',
        gallery: [marker1, marker2, marker3],
        galleryLayout: 'portrait',
    },
];
