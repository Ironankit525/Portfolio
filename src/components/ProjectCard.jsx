import { ArrowUpRight, MousePointerClick } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { interactiveLabel, projectHref } from '../data/projectModel';
import { trackPointer } from '../lib/pointer';

// One project. The layout is driven by the card's own width (container queries in
// projects.css): narrow cards stack, wide cards put the picture beside the text and
// show the metrics. The title link is stretched over the whole card.
export default function ProjectCard({ project, featured = false }) {
    const interactive = interactiveLabel(project);

    return (
        <article className="project-card panel spot" onPointerMove={trackPointer}>
            <div className={`project-media${project.previewImage ? ' has-preview' : ''}`}>
                <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" decoding="async" />
                {project.previewImage && <img className="project-media-preview" src={project.previewImage} alt="" loading="lazy" decoding="async" />}
                <span className="project-media-cta" aria-hidden="true">Read the case study <ArrowUpRight size={15} /></span>
            </div>

            <div className="project-body">
                <p className="project-meta">
                    {project.category || 'Project'}
                    {featured && <span>Featured</span>}
                    {interactive && <span className="project-flag"><MousePointerClick size={12} aria-hidden="true" /> {interactive}</span>}
                </p>
                <h3>
                    <a className="project-link" href={projectHref(project)}>{project.title}</a>
                </h3>
                {project.subtitle && <p className="project-subtitle">{project.subtitle}</p>}
                <p className="project-summary">{project.summary}</p>

                {project.metrics?.length > 0 && (
                    <dl className="project-metrics">
                        {project.metrics.map((metric) => (
                            <div key={metric.label}>
                                <dt>{metric.label}</dt>
                                <dd>{metric.value}</dd>
                            </div>
                        ))}
                    </dl>
                )}

                <ul className="chip-list project-tags" aria-label="Built with">
                    {project.tags?.map((tag) => <li className="chip" key={tag}>{tag}</li>)}
                </ul>

                <div className="project-links">
                    <span className="project-open" aria-hidden="true">Case study <ArrowUpRight size={15} /></span>
                    {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Live site of ${project.title}`}>
                            Live site <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    )}
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`Source code of ${project.title}`}>
                            <FaGithub size={14} aria-hidden="true" /> Code
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
