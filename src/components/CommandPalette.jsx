import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Copy, CornerDownLeft, Download, FileText, FolderGit2, Hash, Mail, Moon, Search, Sun } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { profile, sections } from '../data/profile';
import { projectHref } from '../data/projectModel';
import { goToSection, setHash } from '../lib/router';

const openInNewTab = (url) => window.open(url, '_blank', 'noopener,noreferrer');

function downloadResume() {
    const link = document.createElement('a');
    link.href = profile.resumeUrl;
    link.download = '';
    link.click();
}

function buildCommands({ projects, theme, onToggleTheme }) {
    return [
        ...sections.map((section) => ({
            id: `go-${section.id}`,
            group: 'Go to',
            label: section.label,
            icon: Hash,
            run: () => goToSection(section.id),
        })),
        ...projects.map((project) => ({
            id: `project-${project.id}`,
            group: 'Case studies',
            label: project.title,
            hint: project.subtitle,
            keywords: [project.category, ...(project.tags ?? [])].join(' '),
            icon: FolderGit2,
            run: () => setHash(projectHref(project)),
        })),
        { id: 'resume-view', group: 'Actions', label: 'View résumé', keywords: 'cv pdf resume open read', icon: FileText, external: true, run: () => openInNewTab(profile.resumeUrl) },
        { id: 'resume', group: 'Actions', label: 'Download résumé', keywords: 'cv pdf resume save', icon: Download, run: downloadResume },
        { id: 'copy-email', group: 'Actions', label: 'Copy email address', hint: profile.email, keywords: 'contact mail', icon: Copy, run: () => navigator.clipboard?.writeText(profile.email) },
        { id: 'email', group: 'Actions', label: 'Write me an email', keywords: 'contact mail hire', icon: Mail, run: () => { window.location.href = `mailto:${profile.email}`; } },
        { id: 'theme', group: 'Actions', label: `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`, keywords: 'dark light mode appearance', icon: theme === 'dark' ? Sun : Moon, run: () => onToggleTheme() },
        { id: 'github', group: 'Links', label: 'GitHub profile', keywords: 'code repositories open source', icon: FaGithub, external: true, run: () => openInNewTab(profile.links.github) },
        { id: 'linkedin', group: 'Links', label: 'LinkedIn profile', keywords: 'connect', icon: FaLinkedinIn, external: true, run: () => openInNewTab(profile.links.linkedin) },
    ];
}

// Every word typed must appear somewhere in the command's text.
function matches(command, query) {
    const text = `${command.label} ${command.group} ${command.hint ?? ''} ${command.keywords ?? ''}`.toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every((word) => text.includes(word));
}

// The ⌘K menu: jump to a section, open a case study, or run an action from the keyboard.
// Rendered only while open, so its state starts fresh each time.
export default function CommandPalette({ projects, theme, onToggleTheme, onClose }) {
    const dialogRef = useRef(null);
    const listRef = useRef(null);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const commands = useMemo(() => buildCommands({ projects, theme, onToggleTheme }), [projects, theme, onToggleTheme]);
    const results = commands.filter((command) => matches(command, query));
    const active = results[Math.min(activeIndex, results.length - 1)];

    // A layout effect, so close() runs before React removes the element and focus
    // returns to wherever it was when the menu opened.
    useLayoutEffect(() => {
        const dialog = dialogRef.current;
        dialog.showModal();
        return () => dialog.close();
    }, []);

    useEffect(() => {
        listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    function run(command) {
        onClose();
        command.run();
    }

    function onKeyDown(event) {
        const last = results.length - 1;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((index) => (index >= last ? 0 : index + 1));
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex((index) => (index <= 0 ? last : index - 1));
        } else if (event.key === 'Enter' && active) {
            event.preventDefault();
            run(active);
        }
    }

    let previousGroup = null;

    return (
        <dialog
            ref={dialogRef}
            className="palette"
            aria-label="Command menu"
            // Escape fires `cancel`. (Not `close`: that also fires when React's dev-mode
            // effect check closes and reopens the dialog, which would dismiss it at once.)
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="palette-box">
                <label className="palette-search">
                    <Search size={18} aria-hidden="true" />
                    <span className="sr-only">Search commands</span>
                    <input
                        type="text"
                        role="combobox"
                        aria-expanded="true"
                        aria-controls="palette-list"
                        aria-activedescendant={active ? `palette-${active.id}` : undefined}
                        aria-autocomplete="list"
                        autoComplete="off"
                        spellCheck="false"
                        placeholder="Search or jump to…"
                        value={query}
                        onChange={(event) => {
                            setQuery(event.target.value);
                            setActiveIndex(0);
                        }}
                        onKeyDown={onKeyDown}
                        autoFocus
                    />
                    <kbd>Esc</kbd>
                </label>

                <ul id="palette-list" ref={listRef} className="palette-list" role="listbox" aria-label="Commands">
                    {results.map((command) => {
                        const Icon = command.icon;
                        const heading = command.group !== previousGroup ? command.group : null;
                        previousGroup = command.group;
                        const selected = command === active;
                        return (
                            <li key={command.id} role="presentation">
                                {heading && <p className="palette-group" role="presentation">{heading}</p>}
                                <button
                                    type="button"
                                    id={`palette-${command.id}`}
                                    role="option"
                                    aria-selected={selected}
                                    tabIndex={-1}
                                    onClick={() => run(command)}
                                    onPointerMove={() => setActiveIndex(results.indexOf(command))}
                                >
                                    <Icon size={16} aria-hidden="true" />
                                    <span className="palette-label">{command.label}</span>
                                    {command.hint && <span className="palette-hint">{command.hint}</span>}
                                    {command.external && <ArrowUpRight size={14} className="palette-external" aria-hidden="true" />}
                                    {selected && <CornerDownLeft size={14} className="palette-enter" aria-hidden="true" />}
                                </button>
                            </li>
                        );
                    })}
                    {results.length === 0 && <li className="palette-empty" role="presentation">Nothing matches “{query}”.</li>}
                </ul>

                <p className="palette-foot" aria-hidden="true">
                    <span><kbd>↑</kbd><kbd>↓</kbd> to move</span>
                    <span><kbd>↵</kbd> to select</span>
                    <span><kbd>Esc</kbd> to close</span>
                </p>
            </div>
        </dialog>
    );
}
