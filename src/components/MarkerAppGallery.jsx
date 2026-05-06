import { ArrowLeft } from 'lucide-react';

import img1 from '../assets/Screenshot_20260507_001110.jpg';
import img2 from '../assets/Screenshot_20260507_001040.jpg';
import img3 from '../assets/Screenshot_20260507_001033.jpg';

const images = [img1, img2, img3];

export default function MarkerAppGallery() {
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
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Custom Marker Detection App</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
                        An Android native application built with React Native that uses the device camera to detect, isolate, and extract custom printable visual markers with orientation correction and geometric skew adjustment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {images.map((src, index) => (
                        <div key={index} className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 aspect-[9/19] relative">
                            <img src={src} alt={`Project screenshot ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
