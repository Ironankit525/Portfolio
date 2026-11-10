// Open-source contributions. The section reads pull requests live from GitHub and
// falls back to openSourceSnapshot.json (refresh it with `npm run snapshot`).
// This file has no browser-only code, so the snapshot script can import it too.

export const GITHUB_USER = 'Ironankit525';

// Pull requests to these owners are not upstream contributions: my own repositories
// and a teammate's hackathon project.
const IGNORED_OWNERS = ['ironankit525', 'alokkumardalei-wq'];

// Friendly names for the projects worth introducing. `language` must match a skill
// name in skills.js so the toolkit can link the skill to the contribution.
// A repository that is not listed here still shows up, under its GitHub name.
const KNOWN_PROJECTS = {
    'apache/airflow': { name: 'Apache Airflow', blurb: 'Workflow orchestration platform', language: 'Python' },
    'apache/storm': { name: 'Apache Storm', blurb: 'Distributed real-time computation', language: 'Java' },
    'meshery/meshery': { name: 'Meshery', blurb: 'Cloud native manager, a CNCF project', language: 'Golang' },
    'sktime/sktime': { name: 'sktime', blurb: 'Time-series machine learning', language: 'Python' },
    'sktime/skpro': { name: 'skpro', blurb: 'Probabilistic prediction for tabular data', language: 'Python' },
    'volcano-sh/volcano': { name: 'Volcano', blurb: 'Cloud native batch system, a CNCF project', language: 'Golang' },
    'kubearmor/KubeArmor': { name: 'KubeArmor', blurb: 'Runtime security enforcement', language: 'Golang' },
    'goharbor/harbor': { name: 'Harbor', blurb: 'Cloud native container registry', language: 'Golang' },
    'openkruise/agents': { name: 'OpenKruise Agents', blurb: 'Agent sandbox lifecycle on Kubernetes', language: 'Golang' },
};

const search = (query) => encodeURIComponent(query).replace(/%20/g, '+');

export const PR_SEARCH_API = `https://api.github.com/search/issues?q=${search(`author:${GITHUB_USER} type:pr`)}&sort=created&order=desc&per_page=100`;
export const ALL_PRS_URL = `https://github.com/search?q=${search(`author:${GITHUB_USER} type:pr is:merged`)}&type=pullrequests`;

// GitHub search results -> the few fields the site needs. Closed-without-merge
// pull requests are dropped: the section shows what landed and what is in review.
export function normalizePullRequests(items) {
    return items
        .map((item) => {
            const mergedAt = item.pull_request?.merged_at;
            return {
                repo: item.repository_url.split('/repos/')[1],
                number: item.number,
                title: item.title,
                url: item.html_url,
                state: mergedAt ? 'merged' : item.state,
                date: mergedAt || item.created_at,
            };
        })
        .filter((pr) => pr.state !== 'closed' && !IGNORED_OWNERS.includes(pr.repo.split('/')[0].toLowerCase()))
        .sort((a, b) => b.date.localeCompare(a.date));
}

export function describeProject(repo) {
    const [owner, name] = repo.split('/');
    return {
        repo,
        name,
        blurb: `${owner}/${name}`,
        language: null,
        ...KNOWN_PROJECTS[repo],
        avatar: `https://github.com/${owner}.png?size=96`,
        url: `https://github.com/${repo}/pulls?q=${search(`is:pr author:${GITHUB_USER}`)}`,
    };
}

// Pull requests -> totals plus one entry per project, strongest first.
export function summarizeContributions(pullRequests) {
    const counts = new Map();
    for (const pr of pullRequests) {
        const entry = counts.get(pr.repo) ?? { merged: 0, open: 0 };
        entry[pr.state] += 1;
        counts.set(pr.repo, entry);
    }
    const projects = [...counts.entries()]
        .map(([repo, count]) => ({ ...describeProject(repo), ...count }))
        .sort((a, b) => b.merged - a.merged || b.open - a.open || a.name.localeCompare(b.name));
    return {
        pullRequests,
        projects,
        merged: pullRequests.filter((pr) => pr.state === 'merged').length,
        open: pullRequests.filter((pr) => pr.state === 'open').length,
    };
}
