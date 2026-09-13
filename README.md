# Ankit Kumar — Portfolio

A React portfolio with a black, white, and lime theme, responsive project cards,
project galleries, filterable skills, reduced-motion support, and a contact form.

## Run locally

```sh
npm install
npm run dev
```

Build for deployment with `npm run build`. Vite writes the static site to `dist/`.
The existing deployment setup does not need to change.

## Add a project

**Edit one file: `src/data/projects.js`.** Add your image to `src/assets/`, import
it at the top of the data file, then add an object to the `projects` array:

```js
import myProjectCover from '../assets/my-project.webp';

// Add this object inside the exported projects array:
{
    id: 'my-project',
    title: 'My Project',
    category: 'Web',
    description: 'What the project does and the problem it solves.',
    image: myProjectCover,
    imageAlt: 'A descriptive caption for the project preview',
    tags: ['React', 'Node.js'],
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/your-name/my-project',
    gallery: [myProjectCover],
},
```

- Give each project a **unique, stable `id`**, preferably lowercase with hyphens.
- Array order controls display order. With at least three projects, the first
  gets a larger featured card; all additional projects flow into the grid.
- `category` creates the project filters automatically. Reuse `Web` or `Mobile`,
  or introduce a new category such as `AI` without editing the UI.
- `imageAlt` and `tags` are optional, but useful for accessibility and context.
- `liveUrl` and `githubUrl` are optional. Missing links are simply hidden.
- `gallery` is optional. Without it, the detail view displays the cover image.
  Import additional images and list them here to create a screenshot gallery.
- Use `galleryLayout: 'portrait'` for mobile screenshots.
- Project links are generated automatically as `#/project/my-project`. No route
  registration or new React component is needed. Optional `slug` preserves a
  different existing URL; the `id` URL also works.
- The open-source strip is independent of project records and links to GitHub.

You can also place images in `public/projects/` and use a string such as
`image: '/projects/my-project.webp'` instead of an import.

## Where content lives

| Content | File |
| --- | --- |
| Projects, links, screenshots | `src/data/projects.js` |
| About copy | `src/components/AboutSection.jsx` |
| Skills and currently exploring | `src/components/IntegrationSection.jsx` |
| Contact copy and email | `src/components/ContactSection.jsx` |
| Landing screen and navigation | `src/App.jsx` |
| Theme, responsive layouts, hover states | `src/index.css` |

Project cards and routing share the helpers in `src/data/projectModel.js`.
`ProjectDetail.jsx` provides the reusable gallery dialog, keyboard dismissal,
and focus containment. The older standalone gallery files are retained for
reference but are no longer used by the app.

## Contact form

The form retains the existing Formspree endpoint in `ContactSection.jsx`.
It validates required fields, disables repeat submission while sending, and
shows success or failure feedback. Test submissions send real email.

## Stack

React 19 (JavaScript / JSX), Vite, Tailwind CSS, Framer Motion, Lucide,
and React Icons. Existing dependencies and the package lock are preserved.
