import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, LoaderCircle, MousePointerClick, RotateCcw } from 'lucide-react';

// "Try it" in a case study: the project's live site, running inside the page.
// Nothing is fetched until the visitor asks for it. On small screens the frame would
// be too cramped to use, so the button opens the site in a new tab instead (see
// .demo-load and .demo-open in demos.css).
export default function LiveDemo({ project }) {
    const [loaded, setLoaded] = useState(false);
    const [ready, setReady] = useState(false);
    const [run, setRun] = useState(0);
    const frameRef = useRef(null);
    const host = new URL(project.liveUrl).host;

    // The button that was pressed is gone, so hand the keyboard to the demo.
    useEffect(() => {
        if (loaded) frameRef.current.focus();
    }, [loaded, run]);

    return (
        <section className="case-section" aria-labelledby="demo-title">
            <h2 id="demo-title" className="case-heading">Try it</h2>
            {project.demo.hint && <p className="case-note">{project.demo.hint}</p>}

            <div className="demo">
                <div className="demo-bar">
                    <span className="demo-dots" aria-hidden="true"><i /><i /><i /></span>
                    <span className="demo-url">{host}</span>
                    {loaded && (
                        <button
                            type="button"
                            className="demo-action"
                            onClick={() => {
                                setReady(false);
                                setRun(run + 1);
                            }}
                        >
                            <RotateCcw size={14} aria-hidden="true" /> Restart
                        </button>
                    )}
                    <a className="demo-action" href={project.liveUrl} target="_blank" rel="noreferrer">
                        Open in a new tab <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                </div>

                <div className="demo-stage">
                    {loaded ? (
                        <>
                            {/* Sits behind the frame, so the app covers it as soon as it draws.
                                (The load event can come much later, once every image is in.) */}
                            {!ready && (
                                <p className="demo-loading" role="status">
                                    <LoaderCircle size={18} className="button-spinner" aria-hidden="true" /> Loading the demo…
                                </p>
                            )}
                            <iframe
                                key={run}
                                ref={frameRef}
                                src={project.liveUrl}
                                title={`${project.title}: live demo`}
                                // The demo may run scripts and keep its own data, but it cannot navigate this page away.
                                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
                                onLoad={() => setReady(true)}
                            />
                        </>
                    ) : (
                        <div className="demo-poster">
                            <img src={project.image} alt="" loading="lazy" decoding="async" />
                            <div className="demo-prompt">
                                <button type="button" className="button button-primary button-lg demo-load" onClick={() => setLoaded(true)}>
                                    <MousePointerClick size={18} aria-hidden="true" /> Load the live demo
                                </button>
                                <a className="button button-primary button-lg demo-open" href={project.liveUrl} target="_blank" rel="noreferrer">
                                    Open the live demo <ArrowUpRight size={18} aria-hidden="true" />
                                </a>
                                <p>The real app, running from {host}.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
