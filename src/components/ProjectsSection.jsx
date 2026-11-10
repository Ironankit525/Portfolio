import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cardSpans, filterProjects, projectCategories } from '../data/projectModel';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';

export default function ProjectsSection({ items = [] }) {
    const [category, setCategory] = useState(null);
    const categories = projectCategories(items);
    const activeCategory = categories.includes(category) ? category : null;
    const visible = filterProjects(items, activeCategory);
    // The first project gets the wide featured card when everything is on show.
    const hasFeatured = activeCategory === null && visible.length >= 3;
    const spans = cardSpans(visible.length, hasFeatured);

    return (
        <section id="projects" className="section" aria-labelledby="projects-title">
            <div className="container">
                <Reveal className="section-header">
                    <div>
                        <p className="kicker"><span>02</span> / Selected work</p>
                        <h2 id="projects-title">Ideas, made <em>real.</em></h2>
                        <p className="lede">Each project opens into a short case study: what it does, what I built and what came of it.</p>
                    </div>
                    {categories.length > 1 && (
                        <div className="filter-list" role="group" aria-label="Filter projects">
                            <button type="button" aria-pressed={activeCategory === null} onClick={() => setCategory(null)}>
                                All <span>{items.length}</span>
                            </button>
                            {categories.map((item) => (
                                <button type="button" key={item} aria-pressed={activeCategory === item} onClick={() => setCategory(item)}>
                                    {item} <span>{items.filter((project) => project.category === item).length}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </Reveal>

                <p className="sr-only" role="status">
                    {visible.length} {visible.length === 1 ? 'project' : 'projects'} shown{activeCategory ? ` in ${activeCategory}` : ''}.
                </p>

                <div className="project-grid">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {visible.map((project, index) => (
                            <motion.div
                                key={project.id}
                                layout="position"
                                className="project-slot"
                                style={{ '--span': spans[index].desktop, '--span-tablet': spans[index].tablet }}
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <ProjectCard project={project} featured={hasFeatured && index === 0} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {visible.length === 0 && <p className="project-empty">New projects are on the way.</p>}
            </div>
        </section>
    );
}
