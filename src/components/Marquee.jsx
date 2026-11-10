import { Sparkle } from 'lucide-react';

const WORDS = ['Full-stack web', 'AI pipelines', 'Computer vision', 'Open source', 'Automation', 'Backend systems'];

// A decorative strip between the hero and the first section. The list is rendered
// twice so the loop is seamless; it is hidden from screen readers.
export default function Marquee() {
    return (
        <div className="marquee" aria-hidden="true">
            <div className="marquee-track">
                {[0, 1].map((copy) => (
                    <ul key={copy}>
                        {WORDS.map((word) => (
                            <li key={word}>
                                {word}
                                <Sparkle size={16} />
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </div>
    );
}
