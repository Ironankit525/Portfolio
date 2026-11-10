import { ArrowDownRight, GraduationCap, Target } from 'lucide-react';
import { profile } from '../data/profile';
import { trackPointer } from '../lib/pointer';
import Reveal from './Reveal';

export default function AboutSection() {
    return (
        <section id="about" className="section" aria-labelledby="about-title">
            <div className="container">
                <Reveal>
                    <p className="kicker"><span>01</span> / About</p>
                </Reveal>

                <div className="about-grid">
                    <Reveal className="panel about-main spot" onPointerMove={trackPointer}>
                        <h2 id="about-title">Curiosity into <em>code.</em><br />Ideas into impact.</h2>
                        <div className="about-copy">
                            {profile.about.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                        </div>
                        <ul className="chip-list" aria-label="Focus areas">
                            {profile.focus.map((item) => <li className="chip" key={item}>{item}</li>)}
                        </ul>
                        <a className="text-link" href="#projects">Explore my work <ArrowDownRight size={17} aria-hidden="true" /></a>
                    </Reveal>

                    <Reveal className="panel about-card spot" delay={0.08} onPointerMove={trackPointer}>
                        <h3 className="panel-title"><GraduationCap size={16} aria-hidden="true" /> Education</h3>
                        <ol className="timeline">
                            {profile.education.map((entry) => (
                                <li key={entry.title}>
                                    <p className="timeline-period">{entry.period}</p>
                                    <p className="timeline-title">{entry.title}</p>
                                    {entry.detail && <p className="timeline-detail">{entry.detail}</p>}
                                    <p className="timeline-place">{entry.place}</p>
                                    {entry.coursework && (
                                        <ul className="chip-list" aria-label="Coursework">
                                            {entry.coursework.map((course) => <li className="chip" key={course}>{course}</li>)}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </Reveal>

                    <Reveal className="panel about-card about-next spot" delay={0.16} onPointerMove={trackPointer}>
                        <h3 className="panel-title"><Target size={16} aria-hidden="true" /> What I’m looking for</h3>
                        <p className="about-lead">{profile.lookingFor}</p>
                        <dl className="about-facts">
                            <div>
                                <dt>Preparing for</dt>
                                <dd>{profile.goals.join(' and ')}</dd>
                            </div>
                            <div>
                                <dt>Currently exploring</dt>
                                <dd>
                                    <ul className="chip-list">
                                        {profile.exploring.map((item) => <li className="chip" key={item}>{item}</li>)}
                                    </ul>
                                </dd>
                            </div>
                        </dl>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
