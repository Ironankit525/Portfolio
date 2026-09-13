import { useState } from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { filterProjects, projectCategories, projectHref } from '../data/projectModel';
import Reveal from './Reveal';

function ProjectCard({ project, featured, index }) {
    const reducedMotion = useReducedMotion();
    return (
        <motion.article
            layout={!reducedMotion}
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.2) }}
            className={`project-card studio-panel${featured ? ' project-featured' : ''}`}
        >
            <a href={projectHref(project)} className="project-main" aria-label={`View ${project.title}`}>
                <div className="project-image">
                    <img src={project.image} alt={project.imageAlt || project.title} loading="lazy" decoding="async" />
                    <span className="project-image-action">Explore project <ArrowUpRight size={16} /></span>
                </div>
                <div className="project-heading">
                    <div>
                        <p className="project-category">{project.category || 'PROJECT'}{featured && <span> / FEATURED</span>}</p>
                        <h3>{project.title}</h3>
                    </div>
                    <span className="circle-arrow" aria-hidden="true"><ArrowUpRight size={22} /></span>
                </div>
                <p className="project-description">{project.description}</p>
            </a>
            <div className="project-bottom">
                <div className="tag-list">{project.tags?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="project-links">
                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Live site: ${project.title}`}>Live site <ArrowUpRight size={14} /></a>}
                    {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label={`Source code: ${project.title}`}><Github size={15} /> Code</a>}
                </div>
            </div>
        </motion.article>
    );
}

export default function FeaturedProjectsSection({ items = [] }) {
    const [category, setCategory] = useState(null);
    const categories = projectCategories(items);
    const activeCategory = categories.includes(category) ? category : null;
    const visibleProjects = filterProjects(items, activeCategory);
    return (
        <section id="projects" className="studio-section" aria-labelledby="projects-title">
            <Reveal>
                <p className="section-kicker"><span>02</span> / SELECTED WORK</p>
                <div className="section-heading">
                    <div>
                        <h2 id="projects-title">Ideas, made <em>real.</em></h2>
                        <p>A few things I’ve built. And what I learned along the way.</p>
                    </div>
                    {categories.length > 1 && <div className="filter-list" role="group" aria-label="Filter projects">
                        <button type="button" aria-pressed={activeCategory === null} onClick={() => setCategory(null)}>All work <span>{items.length}</span></button>
                        {categories.map((item) => <button type="button" key={item} aria-pressed={activeCategory === item} onClick={() => setCategory(item)}>{item}</button>)}
                    </div>}
                </div>
                <p className="sr-only" role="status">{visibleProjects.length} projects shown{activeCategory ? ` in ${activeCategory}` : ''}.</p>
                <div className={`project-grid${activeCategory !== null || visibleProjects.length < 3 ? ' project-grid-regular' : ''}`}>
                    {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} featured={activeCategory === null && visibleProjects.length >= 3 && index === 0} />)}
                </div>
                {visibleProjects.length === 0 && <p className="empty-projects">New projects are on the way. In the meantime, explore my work on GitHub.</p>}
                <a className="open-source-strip studio-panel" href="https://github.com/Ironankit525" target="_blank" rel="noreferrer">
                    <span className="open-source-icon"><Github size={28} /></span>
                    <span className="open-source-copy"><strong>Built to share.</strong><span>Open-source contributions, experiments, and work in progress.</span></span>
                    <span className="text-link">Explore my GitHub <ArrowUpRight size={18} /></span>
                </a>
            </Reveal>
        </section>
    );
}
