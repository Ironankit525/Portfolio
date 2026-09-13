import { useState } from 'react';
import { BrainCircuit, Code2, Cpu, GitCommit, GitPullRequest, Server, ShieldCheck, Workflow } from 'lucide-react';
import { SiJavascript, SiHtml5, SiCss, SiReact, SiFigma, SiPython, SiRust, SiGo, SiLinux, SiDocker, SiKubernetes, SiMongodb, SiN8N, SiGooglesheets } from 'react-icons/si';
import { FaJava, FaGitAlt, FaGithub } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import Reveal from './Reveal';

const groups = [
    { name: 'Everyday', items: [['React', SiReact], ['JavaScript', SiJavascript], ['Python', SiPython], ['Java', FaJava], ['Docker', SiDocker], ['Git', FaGitAlt]] },
    { name: 'Frontend', items: [['JavaScript', SiJavascript], ['HTML5', SiHtml5], ['CSS3', SiCss], ['React', SiReact], ['Figma', SiFigma]] },
    { name: 'Backend & data', items: [['Java', FaJava], ['Python', SiPython], ['Rust', SiRust], ['Golang', SiGo], ['MongoDB', SiMongodb], ['Google Sheets', SiGooglesheets]] },
    { name: 'Tools & infrastructure', items: [['Linux', SiLinux], ['Docker', SiDocker], ['Kubernetes', SiKubernetes], ['Git', FaGitAlt], ['GitHub', FaGithub], ['VS Code', VscVscode], ['n8n', SiN8N]] },
    { name: 'Foundations', items: [['DSA', BrainCircuit], ['OOP', Code2], ['Problem solving', Workflow], ['Version control', GitCommit], ['Open source', GitPullRequest]] },
];
const exploring = [['Cybersecurity basics', ShieldCheck], ['Backend systems', Server], ['GC-aware memory', Cpu], ['Golang', SiGo]];

export default function IntegrationSection() {
    const [selected, setSelected] = useState('Everyday');
    const activeGroup = groups.find((group) => group.name === selected);
    return (
        <section id="integrations" className="studio-section toolkit-section" aria-labelledby="toolkit-title">
            <Reveal>
                <p className="section-kicker"><span>03</span> / SKILLS & TOOLS</p>
                <div className="section-heading">
                    <div><h2 id="toolkit-title">My everyday <em>toolkit.</em></h2><p>The languages, tools, and foundations behind my work.</p></div>
                </div>
                <div className="toolkit-filters filter-list" role="group" aria-label="Filter skills">
                    {groups.map((group) => <button type="button" key={group.name} aria-pressed={selected === group.name} onClick={() => setSelected(group.name)}>{group.name}</button>)}
                </div>
                <div className="toolkit-grid" aria-live="polite" aria-label={`${selected} skills`}>
                    {activeGroup.items.map(([name, Icon]) => <div className="tool-tile" key={name}><Icon size={28} aria-hidden="true" /><span>{name}</span></div>)}
                </div>
                <div className="exploring-strip">
                    <span className="exploring-label"><span className="status-dot" />Currently exploring</span>
                    <div>{exploring.map(([name, Icon]) => <span key={name}><Icon size={16} aria-hidden="true" />{name}</span>)}</div>
                </div>
            </Reveal>
        </section>
    );
}
