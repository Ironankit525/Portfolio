# Ankit Kumar — Portfolio

A React portfolio in black, white and lime: a hero with a water effect that ripples under
the cursor, project case studies with a live demo and an interactive figure, a linked
skills toolkit, a short open-source band fed from GitHub, a ⌘K command menu and a
contact form. Live at <https://ankitdevportfolio.vercel.app>.

## Run locally

```sh
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm run lint` | Check the code with ESLint |
| `npm run snapshot` | Refresh the saved copy of my pull requests (see below) |

## Where content lives

Almost everything you will want to change is data, not components.

| To change | Edit |
| --- | --- |
| Name, intro, education, goals, email, links, hero numbers | `src/data/profile.js` |
| Projects and their case studies | `src/data/projects.js` |
| Skills and their groups | `src/data/skills.js` |
| Which open-source projects get a friendly name | `src/data/openSource.js` |
| Résumé (the view and download buttons) | replace `public/Ankit_Kumar_Resume.pdf` |
| Hero water image | replace `src/assets/hero-water.webp` |
| Portrait | replace `src/assets/portrait.webp` |
| Colours, fonts, spacing | the tokens at the top of `src/index.css` |
| Page title, description, link-preview image | `index.html` and `public/og-image.jpg` |

Section styles are in `src/styles/`, one file per section. The interactive parts of the
case studies are styled in `src/styles/demos.css`.

## Add a project

**Edit one file: `src/data/projects.js`.** Put the screenshots in
`src/assets/projects/<name>/` (WebP, about 1920px wide), import them at the top of the
file, and add an object to the `projects` array:

```js
import myCover from '../assets/projects/my-project/cover.webp';
import myDetail from '../assets/projects/my-project/detail.webp';

{
    id: 'my-project',
    title: 'My Project',
    subtitle: 'One line saying what kind of thing it is',
    category: 'Web',
    summary: 'One sentence for the card.',
    overview: 'A short paragraph for the top of the case study.',
    highlights: ['What I built, one point per line.', 'Another point.'],
    metrics: [{ value: '3×', label: 'faster than before' }],
    tags: ['React', 'Node.js'],
    skills: ['React', 'Node.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/your-name/my-project',
    image: myCover,
    imageAlt: 'What the cover picture shows',
    previewImage: myDetail,
    gallery: [
        { src: myCover, caption: 'Home screen', alt: 'What this picture shows' },
        { src: myDetail, caption: 'Detail screen', alt: 'What this picture shows' },
    ],
},
```

Only `id`, `title`, `summary` and `image` are required. Everything else is optional and
is simply left out of the page when missing.

- **`id`** must be unique and stable; it becomes the link `#/project/my-project`.
  `slug` overrides the link if an older URL has to keep working.
- **Order** in the array is display order. With three or more projects, the first one
  gets the wide featured card.
- **`category`** creates the filter buttons automatically.
- **`metrics`** are the big numbers on the wide card and in the case study.
- **`pipeline`** (`[{ step, tool, detail }]`) adds a "How it works" diagram to the case study.
- **`role`** adds a "My role" note to the case study. Use it for team projects.
- **`tags`** are what visitors read. **`skills`** link the project to the toolkit: each
  name must match a skill name in `src/data/skills.js` exactly.
- **`previewImage`** is the second screenshot shown on the card.
- **`gallery`** entries can also be a bare image import. Use `galleryLayout: 'portrait'`
  for phone screenshots.
- **`demo`** (`{ hint }`) adds a "Try it" frame to the case study that runs `liveUrl`
  inside the page. See below before turning it on.
- **`figure`** names an interactive figure to show in the case study. The only one so
  far is `'speaker-tracking'`.

## Interactive parts of a case study

**Live demo (`demo`).** `src/components/LiveDemo.jsx` loads the project's live site in
a frame, but only after the visitor presses "Load the live demo". On phones the button
opens the site in a new tab instead, because the frame would be too small to use.

Check a site before giving it a `demo`: open it in an `<iframe>` and make sure it loads
and is pleasant to use there. The calendar works well. The ARM store is left as a normal
link because it opens with a cookie pop-up inside a frame. A site that sends an
`X-Frame-Options` header cannot be framed at all.

**Speaker-tracking figure (`figure: 'speaker-tracking'`).** The Clipper case study shows
one clip framed two ways: jumping to the face twice a second, and Clipper's dead-band
follow. It is a simulation, not footage.

- `src/lib/tracking.js` holds the numbers. The camera rules and settings are copied from
  `app/reframe.py` in the Clipper repository; the speaker's path is made up. If those
  settings change in Clipper, change them here too.
- `src/components/TrackingDemo.jsx` draws it: three SVG views, a chart that is also the
  timeline, and a slider for the dead band. Its code is a separate file that the browser
  fetches only when the Clipper case study opens.
- The clip starts when it scrolls into view and stops when it leaves. It does not start
  by itself for visitors who prefer reduced motion.

To add another figure, write a component and add it to `FIGURES` in
`src/components/ProjectDetail.jsx`.

## Open-source band

`src/hooks/useOpenSource.js` asks the GitHub search API for my pull requests when the
page loads (one unauthenticated request, cached for an hour). Until that answers, or if
it fails, the page shows the copy saved in `src/data/openSourceSnapshot.json`.

Run `npm run snapshot` now and then to refresh that copy, then commit the file.

Pull requests to my own repositories, and ones closed without merging, are left out.
The rules and the project names are in `src/data/openSource.js`.

## Contact form

The form posts to the Formspree endpoint set at the top of
`src/components/ContactSection.jsx`. Test submissions send real email.

## How it is put together

- `src/App.jsx` composes the page and owns the theme, the route and the command menu.
- `src/lib/router.js` is a tiny hash router. Sections are plain `#anchors`; case studies
  are `#/project/<id>` and open as a full-screen `<dialog>` over the page.
- The hero background is `src/components/WaterField.jsx`, a WebGL water surface from
  the `threejs-components` package. It is bundled with the site and loaded after the
  page has rendered. `DotField.jsx` (a plain canvas dot grid) shows until then, and
  stays if WebGL is unavailable or the visitor prefers reduced motion.
- The theme follows the system setting until the visitor picks one, then remembers it.
- Animations respect the "reduce motion" system setting.

## Stack

React 19, Vite, Framer Motion, threejs-components, Lucide and React Icons, with
self-hosted Geist fonts.
Tailwind CSS provides the reset and a few utilities; the design itself is plain CSS
with custom properties.
