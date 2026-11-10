import { ArrowUpRight, Download } from 'lucide-react';
import { profile } from '../data/profile';

// Two ways to get the résumé in one pill: the label opens the PDF in a new tab,
// the arrow on the right downloads it.
export default function ResumeButton({ label = 'View résumé', variant = 'ghost', size, className = '', onClick }) {
    const classes = ['resume-button', `resume-button-${variant}`, size === 'lg' ? 'resume-button-lg' : '', className].filter(Boolean).join(' ');
    return (
        <span className={classes}>
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer" onClick={onClick}>
                {label} <ArrowUpRight size={size === 'lg' ? 17 : 15} aria-hidden="true" />
            </a>
            <a href={profile.resumeUrl} download aria-label="Download résumé as a PDF" title="Download résumé" onClick={onClick}>
                <Download size={size === 'lg' ? 17 : 15} aria-hidden="true" />
            </a>
        </span>
    );
}
