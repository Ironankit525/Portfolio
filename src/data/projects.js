import clipperDashboard from '../assets/projects/clipper/dashboard.webp';
import clipperQueue from '../assets/projects/clipper/queue.webp';
import armStorefront from '../assets/projects/arm/storefront.webp';
import armProducts from '../assets/projects/arm/products.webp';
import armProductPage from '../assets/projects/arm/product-page.webp';
import armReviews from '../assets/projects/arm/reviews.webp';
import armCheckout from '../assets/projects/arm/checkout.webp';
import armDashboard from '../assets/projects/arm/dashboard.webp';
import armInventory from '../assets/projects/arm/inventory.webp';
import markerCover from '../assets/projects/marker/cover.webp';
import markerScanner from '../assets/projects/marker/scanner.webp';
import markerGalleryOne from '../assets/projects/marker/gallery-1.webp';
import markerGalleryTwo from '../assets/projects/marker/gallery-2.webp';
import calendarMonth from '../assets/projects/calendar/month-view.webp';
import calendarReminder from '../assets/projects/calendar/reminder.webp';
import calendarLayout from '../assets/projects/calendar/layout.webp';

// Add a record here. The cards, filters, case-study pages, command menu and the
// "used in" links of the toolkit all update from this list.
// Order is display order; the first project gets the large featured card.
// The README documents every field. Only id, title, summary and image are required.
export const projects = [
    {
        id: 'clipper',
        title: 'Clipper',
        subtitle: 'Automated short-form video pipeline',
        category: 'AI',
        summary: 'Turns a long podcast into ranked, captioned 9:16 shorts and publishes them to YouTube on a schedule, with nobody at the keyboard.',
        overview: 'Paste a YouTube URL and get back vertical shorts: cut at sensible boundaries, reframed to 9:16, captioned word by word and ranked by how likely each one is to perform. An LLM chooses the clips; the video work (cutting, face tracking and captioning) runs locally, and the whole pipeline is built to run unattended on one machine.',
        highlights: [
            'Built an end-to-end pipeline that converts long podcasts into ranked, captioned 9:16 shorts using yt-dlp, word-level transcription, LLM moment selection and FFmpeg rendering. Seven clips were published to YouTube automatically.',
            'Engineered speaker-tracking reframing with YuNet DNN face detection and a dead-band follow algorithm. It removed camera jitter completely, from 53 snaps to 0, where naive frame-by-frame tracking failed.',
            'Designed a crash-safe FastAPI job queue with idempotent uploads, duplicate and quota guards, and automatic resume. A local n8n workflow drives scheduled posting through the YouTube Data API v3.',
        ],
        metrics: [
            { value: '7', label: 'shorts published to YouTube automatically' },
            { value: '53 → 0', label: 'camera-jitter snaps, against naive frame-by-frame tracking' },
            { value: '9:16', label: 'speaker-tracked, captioned output' },
        ],
        pipeline: [
            { step: 'Download', tool: 'yt-dlp', detail: 'Fetches the source video from a YouTube URL.' },
            { step: 'Transcribe', tool: 'Whisper or Gemini', detail: 'Produces a transcript with word-level timings.' },
            { step: 'Select', tool: 'Gemini or GPT', detail: 'Picks and ranks the strongest moments.' },
            { step: 'Reframe', tool: 'YuNet + FFmpeg', detail: 'Follows the speaker, crops to 9:16 and burns in captions.' },
            { step: 'Review', tool: 'Dashboard', detail: 'Edit the description, then approve each clip.' },
            { step: 'Publish', tool: 'n8n + YouTube Data API', detail: 'Drip-posts the approved clips, a few a day.' },
        ],
        figure: 'speaker-tracking', // the interactive jitter demo (TrackingDemo.jsx)
        tags: ['Python', 'FastAPI', 'FFmpeg', 'OpenCV', 'LLM APIs', 'n8n'],
        skills: ['Python', 'FastAPI', 'FFmpeg', 'OpenCV', 'LLM APIs', 'n8n', 'Speech-to-text', 'Computer vision'],
        githubUrl: 'https://github.com/Ironankit525/clipper',
        image: clipperDashboard,
        imageAlt: 'Clipper dashboard with the clip-making form, previous runs and YouTube Shorts queue counters',
        previewImage: clipperQueue,
        gallery: [
            { src: clipperDashboard, caption: 'Dashboard: paste a URL, choose the number and length of clips, and follow previous runs', alt: 'Clipper dashboard with the clip-making form, previous runs and YouTube Shorts queue counters' },
            { src: clipperQueue, caption: 'Review queue: ranked clips with scores, ready to approve or post', alt: 'Clipper review queue listing ranked clips with scores, durations and post controls' },
        ],
    },
    {
        id: 'arm-ecommerce',
        title: 'ARM E-Commerce Platform',
        subtitle: 'Full-stack online store',
        category: 'Web',
        summary: 'A storefront, checkout and admin dashboard on top of a Node.js backend that handles products, authentication and orders.',
        overview: 'A full-stack e-commerce application. Shoppers browse and buy through a React storefront; a Node.js backend handles product management, user authentication and orders; and an admin dashboard is used to run the store.',
        highlights: [
            'Built a full-stack e-commerce application featuring product management, user authentication and a scalable Node.js backend architecture.',
            'Developed the frontend with React, focusing on performance, clean UI/UX and dynamic product rendering with real-time state updates.',
            'Designed a modular, production-ready codebase with a structured separation of concerns, integrating user authentication and order management APIs.',
        ],
        tags: ['React', 'Node.js', 'Full-stack', 'E-commerce'],
        skills: ['React', 'Node.js', 'RESTful APIs'],
        liveUrl: 'https://armgear.vercel.app',
        image: armStorefront,
        imageAlt: 'ARM storefront home page with a guitar and the headline Master the Strings',
        previewImage: armDashboard,
        gallery: [
            { src: armStorefront, caption: 'Storefront home', alt: 'ARM storefront home page with a guitar and the headline Master the Strings' },
            { src: armProducts, caption: 'Product listing', alt: 'Product grid showing guitar gig bags with prices' },
            { src: armProductPage, caption: 'Product page', alt: 'Product page for a gig bag with photos, price and add-to-cart button' },
            { src: armReviews, caption: 'Customer reviews and ratings', alt: 'Customer reviews section with an overall rating and individual reviews' },
            { src: armCheckout, caption: 'Checkout: contact, delivery and order summary', alt: 'Checkout page with contact and delivery forms beside the order summary' },
            { src: armDashboard, caption: 'Admin dashboard: revenue, sales and inventory analytics', alt: 'Admin dashboard with revenue, sales and inventory charts' },
            { src: armInventory, caption: 'Inventory management', alt: 'Inventory management screen with category lists and a product table' },
        ],
    },
    {
        id: 'marker-app',
        title: 'Custom Marker Detection',
        subtitle: 'Android computer-vision app',
        category: 'Mobile',
        summary: 'Finds custom visual markers in a live camera feed, corrects their orientation and extracts them, in real time.',
        overview: 'An Android app built with React Native for an internship assignment. It opens the device camera, renders the live feed, detects custom visual markers, corrects their orientation and collects the processed markers in a gallery.',
        highlights: [
            'Built an Android application with React Native that accesses the device camera, renders a live feed, detects custom visual markers, applies orientation correction and displays 20 processed markers from 20 different frames.',
            'Implemented a JavaScript-based image-processing pipeline for real-time marker detection with custom mathematical threshold constraints.',
            'Delivered a production-ready APK with a custom app icon for the internship submission.',
        ],
        metrics: [
            { value: '20', label: 'processed markers from 20 different frames' },
            { value: 'APK', label: 'production-ready build delivered' },
        ],
        tags: ['React Native', 'Android', 'Computer vision'],
        skills: ['React Native', 'JavaScript', 'Computer vision'],
        githubUrl: 'https://github.com/Ironankit525/Marker-detection-app',
        image: markerCover,
        imageAlt: 'Custom marker detection app preview: a phone scanning a visual marker',
        galleryLayout: 'portrait',
        gallery: [
            { src: markerScanner, caption: 'Live scanner: line the marker up inside the frame', alt: 'Marker scanner screen showing the live camera feed with an alignment frame and progress counter' },
            { src: markerGalleryOne, caption: 'Marker gallery: extracted and orientation-corrected markers', alt: 'Marker gallery screen with a grid of extracted markers' },
            { src: markerGalleryTwo, caption: 'Marker gallery: 20 markers collected', alt: 'Marker gallery screen showing numbered marker tiles' },
        ],
    },
    {
        id: 'calendar-component',
        slug: 'calendar', // Keeps links that were shared before the redesign working.
        title: 'Calendar Component',
        subtitle: 'Interactive calendar web app',
        category: 'Web',
        summary: 'A neomorphic calendar with seasonal backgrounds, reminders, to-dos and date-range selection.',
        overview: 'An interactive calendar web app with seasonal backgrounds, a neomorphic interface, reminders and to-dos, built with Next.js, React and date-fns.',
        highlights: [
            'A seasonal hero image for every month, swappable by file upload, with an editable quote for each one.',
            'Reminders and multi-task to-do lists on any date, range selection to assign them in bulk, and hover previews on desktop.',
            'Neomorphic light and dark themes, a desktop and mobile layout toggle, and month and year pickers.',
            'Everything persists locally: the schedule and quotes in localStorage, custom backgrounds in IndexedDB.',
        ],
        tags: ['Next.js', 'React', 'date-fns', 'Framer Motion'],
        skills: ['React', 'JavaScript', 'CSS3', 'Responsive UI/UX design'],
        githubUrl: 'https://github.com/Ironankit525/Calander_component',
        liveUrl: 'https://calander-component.vercel.app',
        // Runs the live site inside the case study ("Try it").
        demo: {
            hint: 'This is the real app, not a recording. Click any date to set a reminder or add a to-do. The buttons under the calendar switch between the desktop and phone layouts, and the light and dark themes.',
        },
        image: calendarMonth,
        imageAlt: 'Calendar showing a monthly view beside a photograph of wildflowers',
        previewImage: calendarLayout,
        gallery: [
            { src: calendarMonth, caption: 'Month view with the seasonal hero image', alt: 'Calendar showing a monthly view beside a photograph of wildflowers' },
            { src: calendarReminder, caption: 'Setting a reminder on a date', alt: 'Calendar with a reminder popup open on a date' },
            { src: calendarLayout, caption: 'Range selection with reminder and to-do actions', alt: 'Calendar with four days selected and a menu offering Set Reminder and Add Todo' },
        ],
    },
];
