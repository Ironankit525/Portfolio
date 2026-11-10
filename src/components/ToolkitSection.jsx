import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Telescope } from 'lucide-react';
import { profile } from '../data/profile';
import { projectHref } from '../data/projectModel';
import { skillGroups } from '../data/skills';
import Reveal from './Reveal';

// skill name -> the places it was used: case studies first, then merged upstream work.
function findUses(projects, contributions) {
    const uses = new Map();
    const add = (skill, use) => uses.set(skill, [...(uses.get(skill) ?? []), use]);

    for (const project of projects) {
        for (const skill of project.skills ?? []) {
            add(skill, { key: project.id, label: project.title, note: 'Case study', href: projectHref(project) });
        }
    }
    for (const project of contributions) {
        if (!project.language || project.merged === 0) continue;
        add(project.language, {
            key: project.repo,
            label: project.name,
            note: `${project.merged} merged ${project.merged === 1 ? 'pull request' : 'pull requests'}`,
            href: project.url,
            external: true,
        });
    }
    return uses;
}

export default function ToolkitSection({ projects, openSource }) {
    const uses = useMemo(() => findUses(projects, openSource.projects), [projects, openSource.projects]);
    const [selected, setSelected] = useState('Python');

    return (
        <section id="toolkit" className="section" aria-labelledby="toolkit-title">
            <div className="container">
                <Reveal className="section-header">
                    <div>
                        <p className="kicker"><span>03</span> / Skills &amp; tools</p>
                        <h2 id="toolkit-title">Tools I actually <em>use.</em></h2>
                        <p className="lede">
                            Skills marked with a number are backed by work on this page. Select one to see where I used it.
                        </p>
                    </div>
                </Reveal>

                <div className="toolkit-grid">
                    {skillGroups.map((group, groupIndex) => {
                        const openSkill = group.items.find((skill) => skill.name === selected && uses.has(skill.name));
                        return (
                            <Reveal key={group.name} className="panel skill-group" style={{ '--span': group.span }} delay={(groupIndex % 3) * 0.06}>
                                <h3 className="panel-title">{group.name}</h3>
                                <ul className="skill-list">
                                    {group.items.map(({ name, icon: Icon }) => {
                                        const count = uses.get(name)?.length;
                                        return (
                                            <li key={name}>
                                                {count ? (
                                                    <button
                                                        type="button"
                                                        className="skill is-linked"
                                                        aria-pressed={selected === name}
                                                        aria-label={`${name}, used in ${count} ${count === 1 ? 'place' : 'places'}`}
                                                        onClick={() => setSelected(selected === name ? null : name)}
                                                    >
                                                        <Icon size={17} aria-hidden="true" />
                                                        {name}
                                                        <span className="skill-count" aria-hidden="true">{count}</span>
                                                    </button>
                                                ) : (
                                                    <span className="skill"><Icon size={17} aria-hidden="true" />{name}</span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                <AnimatePresence initial={false}>
                                    {openSkill && (
                                        <motion.div
                                            key={openSkill.name}
                                            className="skill-uses"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                                        >
                                            <div className="skill-uses-inner" role="region" aria-label={`Where I used ${openSkill.name}`}>
                                                <p>Where I used {openSkill.name}</p>
                                                <ul>
                                                    {uses.get(openSkill.name).map((use) => (
                                                        <li key={use.key}>
                                                            <a href={use.href} {...(use.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                                                                <strong>{use.label}</strong>
                                                                <span>{use.note}</span>
                                                                <ArrowUpRight size={15} aria-hidden="true" />
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Reveal>
                        );
                    })}

                    <Reveal className="panel skill-group skill-exploring" style={{ '--span': 6 }} delay={0.06}>
                        <h3 className="panel-title"><Telescope size={16} aria-hidden="true" /> Currently exploring</h3>
                        <ul className="skill-list">
                            {profile.exploring.map((item) => (
                                <li key={item}><span className="skill">{item}</span></li>
                            ))}
                        </ul>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
