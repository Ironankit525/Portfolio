import { ArrowUpRight } from 'lucide-react';
import { ALL_PRS_URL } from '../data/openSource';
import Reveal from './Reveal';

// A short band, not a full section: the totals and the projects my pull requests
// were merged into. `data` comes from useOpenSource(), live from GitHub when possible.
export default function OpenSourceSection({ data }) {
    const merged = data.projects.filter((project) => project.merged > 0);

    return (
        <section id="open-source" className="section section-slim" aria-labelledby="open-source-title">
            <div className="container">
                <Reveal className="panel oss">
                    <div className="oss-copy">
                        <p className="kicker"><span>04</span> / Open source</p>
                        <h2 id="open-source-title">I also contribute <em>upstream.</em></h2>
                        <p>
                            {data.merged} pull requests merged and {data.open} in review, mostly bug fixes and small improvements.
                        </p>
                        <a className="text-link" href={ALL_PRS_URL} target="_blank" rel="noreferrer">
                            See them on GitHub <ArrowUpRight size={16} aria-hidden="true" />
                        </a>
                    </div>

                    <ul className="oss-projects" aria-label="Projects with merged pull requests">
                        {merged.map((project) => (
                            <li key={project.repo}>
                                <a href={project.url} target="_blank" rel="noreferrer">
                                    <img
                                        src={project.avatar}
                                        alt=""
                                        width="32"
                                        height="32"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(event) => {
                                            event.currentTarget.style.visibility = 'hidden';
                                        }}
                                    />
                                    <span className="oss-name">{project.name}</span>
                                    <span className="oss-count">{project.merged} merged</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </Reveal>
            </div>
        </section>
    );
}
