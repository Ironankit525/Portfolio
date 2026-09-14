// Shared by the grid and detail view: new projects need no route registration.
export function projectHref(project) {
    return `#/project/${encodeURIComponent(project.slug || project.id)}`;
}

export function projectForRoute(projects, hash) {
    return projects.find((project) => projectHref(project) === hash || `#/project/${encodeURIComponent(project.id)}` === hash);
}

export function projectCategories(projects) {
    return [...new Set(projects.map((project) => project.category).filter(Boolean))];
}

export function filterProjects(projects, category) {
    return category === null ? projects : projects.filter((project) => project.category === category);
}
