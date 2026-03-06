import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function removeComments(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove single line comments (// ...) but not URLs like http://
    content = content.replace(/(?<!:)\/\/.*$/gm, '');

    // Remove multi-line comments (/* ... */)
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');

    // Remove newly created empty lines that might be left over
    content = content.replace(/^\s*[\r\n]/gm, '');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned: ${filePath}`);
}

const filesToClean = [
    'src/App.tsx',
    'src/main.tsx',
    'src/components/AboutSection.tsx',
    'src/components/ProjectGallery.tsx',
    'src/components/FeaturedProjectsSection.tsx',
    'src/components/IntegrationSection.tsx',
    'src/components/ContactSection.tsx',
    'src/components/LiquidEffectAnimation.tsx'
];

filesToClean.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        removeComments(fullPath);
    }
});
