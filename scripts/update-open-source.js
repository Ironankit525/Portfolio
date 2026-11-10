// Refreshes src/data/openSourceSnapshot.json, the copy of my pull requests the site
// shows until (or instead of) the live GitHub request. Run it with: npm run snapshot
import { writeFile } from 'node:fs/promises';
import { PR_SEARCH_API, normalizePullRequests, summarizeContributions } from '../src/data/openSource.js';

const target = new URL('../src/data/openSourceSnapshot.json', import.meta.url);

const response = await fetch(PR_SEARCH_API, { headers: { Accept: 'application/vnd.github+json' } });
if (!response.ok) {
    console.error(`GitHub answered ${response.status} ${response.statusText}. The snapshot was left unchanged.`);
    process.exit(1);
}

const { items, total_count: total } = await response.json();
if (total > items.length) {
    console.warn(`GitHub has ${total} pull requests but returned ${items.length}; older ones are missing from the snapshot.`);
}

const pullRequests = normalizePullRequests(items);
await writeFile(target, `${JSON.stringify({ fetchedAt: new Date().toISOString(), pullRequests }, null, 2)}\n`);

const { merged, open, projects } = summarizeContributions(pullRequests);
console.log(`Saved ${pullRequests.length} pull requests: ${merged} merged, ${open} in review, across ${projects.length} projects.`);
