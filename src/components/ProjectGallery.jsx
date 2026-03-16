import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import img1 from '../assets/Screenshot 2026-03-06 at 5.55.29 AM.webp';
import img2 from '../assets/Screenshot 2026-03-06 at 5.55.41 AM.webp';
import img3 from '../assets/Screenshot 2026-03-06 at 5.56.15 AM.webp';
import img4 from '../assets/Screenshot 2026-03-06 at 5.56.26 AM.webp';
import img5 from '../assets/Screenshot 2026-03-06 at 5.56.46 AM.webp';
import img6 from '../assets/Screenshot 2026-03-06 at 5.57.37 AM.webp';
import img7 from '../assets/Screenshot 2026-03-06 at 5.57.48 AM.webp';
import img8 from '../assets/Screenshot 2026-03-06 at 5.57.58 AM.webp';
const images = [img1, img2, img3, img4, img5, img6, img7, img8];
export default function ProjectGallery() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white p-6 sm:p-10 font-sans transition-colors">
            <div className="max-w-7xl mx-auto">
                <a
                    href="#projects"
                    onClick={(e) => {
                        if (window.history.length <= 1) {
                            e.preventDefault();
                            window.close();
                        }
                    }}
                    className="inline-flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-[#C3E41D] dark:hover:text-[#C3E41D] transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Portfolio
                </a>
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">ARM E-Commerce Platform</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
                        A comprehensive look at the full-stack e-commerce application, showcasing product management, authentication flows, and our clean, scalable UI/UX.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {images.map((src, index) => (
                        <div key={index} className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 aspect-video group relative">
                            <img src={src} alt={`Project screenshot ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
