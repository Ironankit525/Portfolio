import { ArrowDownRight } from 'lucide-react';
import Reveal from './Reveal';

export default function AboutSection() {
    return (
        <section id="about" className="studio-section about-section" aria-labelledby="about-title">
            <Reveal>
                <p className="section-kicker"><span>01</span> / ABOUT</p>
                <div className="studio-panel about-panel">
                    <div>
                        <h2 id="about-title">Curiosity into <em>code.</em><br />Ideas into impact.</h2>
                        <div className="tag-list about-tags">
                            <span>AI systems</span><span>Full-stack development</span><span>Open source</span>
                        </div>
                    </div>
                    <div className="about-copy">
                        <p>I’m Ankit, a Computer Science student specializing in Artificial Intelligence. I build web experiences, explore intelligent systems, and turn everyday problems into useful software.</p>
                        <p>From automation workflows to backend architecture, I care about clean code, thoughtful interfaces, and understanding how things work.</p>
                        <a className="text-link" href="#projects">Explore my work <ArrowDownRight size={18} /></a>
                    </div>
                </div>
            </Reveal>
        </section>
    );
}
