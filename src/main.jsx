import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
// index.css comes first: it holds the reset and the design tokens the rest build on.
import './index.css';
import './styles/nav.css';
import './styles/hero.css';
import './styles/about.css';
import './styles/projects.css';
import './styles/case-study.css';
import './styles/demos.css';
import './styles/open-source.css';
import './styles/toolkit.css';
import './styles/contact.css';
import './styles/palette.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
