import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowUpRight, Github } from 'lucide-react';

export default function ProjectDetail({ project, route }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        const dialog = dialogRef.current;
        const previousOverflow = document.body.style.overflow;
        dialog.showModal();
        dialog.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        return () => {
            dialog.close();
            document.body.style.overflow = previousOverflow;
        };
    }, [route]);

    return (
        <dialog ref={dialogRef} className="project-dialog studio" aria-labelledby="detail-title" onCancel={() => { window.location.hash = '#projects'; }}>
            <div className="detail-container">
                <a href="#projects" className="text-link detail-back" autoFocus><ArrowLeft size={18} /> Back to projects</a>
                {project ? <>
                    <p className="section-kicker"><span>{project.category || 'PROJECT'}</span> / PROJECT OVERVIEW</p>
                    <h1 id="detail-title">{project.title}</h1>
                    <p className="detail-description">{project.description}</p>
                    <div className="detail-meta">
                        <div className="tag-list">{project.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                        <div className="detail-links">
                            {project.liveUrl && <a className="lime-button" href={project.liveUrl} target="_blank" rel="noreferrer">Visit live site <ArrowUpRight size={18} /></a>}
                            {project.githubUrl && <a className="outline-button" href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={18} /> View source</a>}
                        </div>
                    </div>
                    <div className={`detail-gallery${project.galleryLayout === 'portrait' ? ' detail-gallery-portrait' : ''}`}>
                        {(project.gallery?.length ? project.gallery : [project.image]).map((image, index) => (
                            <figure key={`${image}-${index}`} className="studio-panel">
                                <img src={image} alt={`${project.title} — screenshot ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" />
                                <figcaption><span>{String(index + 1).padStart(2, '0')}</span>{project.title}</figcaption>
                            </figure>
                        ))}
                    </div>
                </> : <><h1 id="detail-title">Project not found.</h1><p className="detail-description">This project link is no longer available. Explore the latest work in the portfolio.</p></>}
            </div>
        </dialog>
    );
}
