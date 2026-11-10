import { Suspense, lazy, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { galleryOf, hasLiveDemo, nextProject, projectHref } from '../data/projectModel';
import { setHash } from '../lib/router';
import Lightbox from './Lightbox';
import LiveDemo from './LiveDemo';

// Interactive figures. A project asks for one with `figure: '<name>'` in projects.js.
// Each is fetched only when its case study opens; if that fetch fails, the case study
// simply shows without the figure.
const figure = (load) => lazy(() => load().catch(() => ({ default: () => null })));
const FIGURES = { 'speaker-tracking': figure(() => import('./TrackingDemo')) };

// Leave the case study without the page behind it jumping.
function closeCaseStudy() {
    setHash('#projects');
    // Opened from a shared link: the page behind is still at the top, so show the projects.
    if (window.scrollY < 40) document.getElementById('projects')?.scrollIntoView({ behavior: 'instant' });
}

// The cover first, then every other screenshot. The lightbox steps through this list.
function slidesFor(project) {
    const gallery = galleryOf(project);
    const cover = gallery.find((item) => item.src === project.image) ?? { src: project.image, caption: project.title, alt: project.imageAlt || project.title };
    return [cover, ...gallery.filter((item) => item.src !== project.image)];
}

function CaseStudy({ project, projects, onZoom }) {
    const slides = slidesFor(project);
    const next = nextProject(projects, project);
    const Figure = FIGURES[project.figure];

    return (
        <article className="container case-body">
            <header className="case-head">
                <p className="kicker"><span>{project.category || 'Project'}</span> / Case study</p>
                <h1 id="case-title">{project.title}</h1>
                {project.subtitle && <p className="case-subtitle">{project.subtitle}</p>}
                <p className="case-lede">{project.overview || project.summary}</p>
                <div className="case-actions">
                    {project.liveUrl && (
                        <a className="button button-primary button-lg" href={project.liveUrl} target="_blank" rel="noreferrer">
                            Visit live site <ArrowUpRight size={18} aria-hidden="true" />
                        </a>
                    )}
                    {project.githubUrl && (
                        <a className="button button-ghost button-lg" href={project.githubUrl} target="_blank" rel="noreferrer">
                            <FaGithub size={17} aria-hidden="true" /> View source
                        </a>
                    )}
                </div>
            </header>

            <button type="button" className="case-cover" onClick={() => onZoom(0)} aria-label={`Enlarge: ${slides[0].caption}`}>
                <img src={slides[0].src} alt={slides[0].alt} decoding="async" />
                <span className="case-zoom" aria-hidden="true"><Expand size={15} /> Enlarge</span>
            </button>

            <div className="case-grid">
                <div>
                    {project.highlights?.length > 0 && (
                        <section aria-labelledby="case-built">
                            <h2 id="case-built" className="case-heading">What I built</h2>
                            <ol className="case-highlights">
                                {project.highlights.map((highlight, index) => (
                                    <li key={highlight}>
                                        <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                                        <p>{highlight}</p>
                                    </li>
                                ))}
                            </ol>
                        </section>
                    )}
                </div>

                <aside className="panel case-aside" aria-label="At a glance">
                    {project.metrics?.length > 0 && (
                        <dl className="case-metrics">
                            {project.metrics.map((metric) => (
                                <div key={metric.label}>
                                    <dt>{metric.label}</dt>
                                    <dd>{metric.value}</dd>
                                </div>
                            ))}
                        </dl>
                    )}
                    <h2 className="panel-title">Built with</h2>
                    <ul className="chip-list">
                        {project.tags?.map((tag) => <li className="chip" key={tag}>{tag}</li>)}
                    </ul>
                    {project.role && (
                        <>
                            <h2 className="panel-title">My role</h2>
                            <p className="case-role">{project.role}</p>
                        </>
                    )}
                </aside>
            </div>

            {hasLiveDemo(project) && <LiveDemo project={project} />}

            {project.pipeline?.length > 0 && (
                <section className="case-section" aria-labelledby="case-pipeline">
                    <h2 id="case-pipeline" className="case-heading">How it works</h2>
                    <ol className="pipeline">
                        {project.pipeline.map((stage, index) => (
                            <li key={stage.step}>
                                <span className="pipeline-index" aria-hidden="true">{index + 1}</span>
                                <p className="pipeline-step">{stage.step}</p>
                                <p className="pipeline-tool">{stage.tool}</p>
                                <p className="pipeline-detail">{stage.detail}</p>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {Figure && <Suspense fallback={null}><Figure /></Suspense>}

            {slides.length > 1 && (
                <section className="case-section" aria-labelledby="case-screens">
                    <h2 id="case-screens" className="case-heading">Screens</h2>
                    <ul className={`case-gallery${project.galleryLayout === 'portrait' ? ' case-gallery-portrait' : ''}`}>
                        {slides.slice(1).map((slide, index) => (
                            <li key={slide.src}>
                                <button type="button" onClick={() => onZoom(index + 1)} aria-label={`Enlarge: ${slide.caption}`}>
                                    <span className="case-thumb"><img src={slide.src} alt={slide.alt} loading="lazy" decoding="async" /></span>
                                    <span className="case-caption">
                                        <span>{String(index + 2).padStart(2, '0')}</span>
                                        {slide.caption}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {next !== project && (
                <a className="panel case-next" href={projectHref(next)}>
                    <span className="kicker">Next project</span>
                    <span className="case-next-title">{next.title} <ArrowRight aria-hidden="true" /></span>
                    <span className="case-next-summary">{next.summary}</span>
                </a>
            )}
        </article>
    );
}

// A full-screen dialog over the page. Being a modal <dialog> gives it focus trapping
// and Escape-to-close for free, and the page underneath keeps its scroll position.
export default function ProjectDetail({ project, projects }) {
    const dialogRef = useRef(null);
    const [zoomed, setZoomed] = useState(null);
    const position = project ? projects.indexOf(project) + 1 : 0;

    // A layout effect, so close() runs before React removes the element and focus
    // returns to the project card that opened the case study.
    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        dialog.showModal();
        dialog.scrollTop = 0;
        root.style.overflow = 'hidden';
        return () => {
            dialog.close();
            root.style.overflow = previousOverflow;
        };
    }, []);

    return (
        <dialog
            ref={dialogRef}
            className="case"
            aria-labelledby="case-title"
            onCancel={(event) => {
                // React also delivers the lightbox's cancel here; that one only closes the lightbox.
                if (event.target !== event.currentTarget) return;
                event.preventDefault();
                closeCaseStudy();
            }}
        >
            <div className="case-bar">
                <button type="button" className="text-link" onClick={closeCaseStudy}>
                    <ArrowLeft size={17} aria-hidden="true" /> All projects
                </button>
                <div className="case-bar-actions">
                    {project && <span className="case-count">{String(position).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span>}
                    {project && projects.length > 1 && (
                        <a className="icon-button" href={projectHref(nextProject(projects, project))} aria-label={`Next project: ${nextProject(projects, project).title}`}>
                            <ArrowRight size={17} aria-hidden="true" />
                        </a>
                    )}
                    <button type="button" className="icon-button" onClick={closeCaseStudy} aria-label="Close case study">
                        <X size={17} aria-hidden="true" />
                    </button>
                </div>
            </div>

            {project ? (
                <CaseStudy project={project} projects={projects} onZoom={setZoomed} />
            ) : (
                <div className="container case-body case-missing">
                    <h1 id="case-title">Project not found.</h1>
                    <p className="case-lede">This link no longer points to a project. The current work is on the main page.</p>
                </div>
            )}

            {project && zoomed !== null && (
                <Lightbox slides={slidesFor(project)} index={zoomed} onIndexChange={setZoomed} onClose={() => setZoomed(null)} />
            )}
        </dialog>
    );
}
