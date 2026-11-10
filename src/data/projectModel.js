// Shared by the grid, the case-study view and the command menu, so a new project
// needs no route registration.

export function projectHref(project) {
    return `#/project/${encodeURIComponent(project.slug || project.id)}`;
}

export const isProjectRoute = (hash) => hash.startsWith('#/project/');

export function projectForRoute(projects, hash) {
    return projects.find((project) => projectHref(project) === hash || `#/project/${encodeURIComponent(project.id)}` === hash);
}

export function projectCategories(projects) {
    return [...new Set(projects.map((project) => project.category).filter(Boolean))];
}

export function filterProjects(projects, category) {
    return category === null ? projects : projects.filter((project) => project.category === category);
}

// Gallery entries may be a bare image or { src, caption, alt }.
export function galleryOf(project) {
    const entries = project.gallery?.length ? project.gallery : [project.image];
    return entries.map((entry, index) => {
        const item = typeof entry === 'string' ? { src: entry } : entry;
        return {
            src: item.src,
            caption: item.caption || project.title,
            alt: item.alt || `${project.title}, screenshot ${index + 1}`,
        };
    });
}

export function nextProject(projects, project) {
    return projects[(projects.indexOf(project) + 1) % projects.length];
}

// The live site can run inside the case study: the project asks for it and has a site to load.
export const hasLiveDemo = (project) => Boolean(project.demo && project.liveUrl);

// What a visitor can play with in the case study, as a short label for the card.
export function interactiveLabel(project) {
    if (hasLiveDemo(project)) return 'Live demo';
    return project.figure ? 'Interactive' : null;
}

// Card widths for the six-column desktop grid and the two-column tablet grid.
// A last row that would be left short is stretched, so the grid never ends with a hole.
export function cardSpans(count, featuredFirst) {
    const lead = featuredFirst ? 1 : 0;
    const rest = count - lead;
    const shortRow = rest % 3;
    return Array.from({ length: count }, (_, position) => {
        if (position < lead) return { desktop: 6, tablet: 2 };
        const index = position - lead;
        return {
            desktop: index >= rest - shortRow ? 6 / shortRow : 2,
            tablet: rest % 2 === 1 && index === rest - 1 ? 2 : 1,
        };
    });
}
