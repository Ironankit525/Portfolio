import { AudioLines, Binary, Boxes, BrainCircuit, GitPullRequest, MonitorSmartphone, Puzzle, ScanEye, Server, Webhook } from 'lucide-react';
import { FaJava } from 'react-icons/fa';
import {
    SiCss, SiDocker, SiFastapi, SiFfmpeg, SiFigma, SiGit, SiGithub, SiGo, SiGooglesheets, SiHtml5, SiJavascript,
    SiLinux, SiMongodb, SiN8N, SiNodedotjs, SiOpencv, SiPython, SiReact, SiRust,
} from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

// The toolkit, grouped as on my résumé. `span` is the card width on a 12-column grid.
//
// A skill becomes clickable when something uses it: a project whose `skills` list
// (projects.js) contains the same name, or an open-source project whose `language`
// (openSource.js) matches it. Keep the names identical in all three files.
export const skillGroups = [
    {
        name: 'Languages',
        span: 5,
        items: [
            { name: 'Python', icon: SiPython },
            { name: 'Java', icon: FaJava },
            { name: 'JavaScript', icon: SiJavascript },
            { name: 'Golang', icon: SiGo },
            { name: 'Rust', icon: SiRust },
            { name: 'HTML5', icon: SiHtml5 },
            { name: 'CSS3', icon: SiCss },
        ],
    },
    {
        name: 'Backend & databases',
        span: 4,
        items: [
            { name: 'Node.js', icon: SiNodedotjs },
            { name: 'FastAPI', icon: SiFastapi },
            { name: 'MongoDB', icon: SiMongodb },
            { name: 'RESTful APIs', icon: Webhook },
            { name: 'Backend systems design', icon: Server },
        ],
    },
    {
        name: 'Frontend',
        span: 3,
        items: [
            { name: 'React', icon: SiReact },
            { name: 'React Native', icon: SiReact },
            { name: 'Figma', icon: SiFigma },
            { name: 'Responsive UI/UX design', icon: MonitorSmartphone },
        ],
    },
    {
        name: 'AI & media',
        span: 4,
        items: [
            { name: 'LLM APIs', icon: BrainCircuit },
            { name: 'FFmpeg', icon: SiFfmpeg },
            { name: 'OpenCV', icon: SiOpencv },
            { name: 'Speech-to-text', icon: AudioLines },
            { name: 'Computer vision', icon: ScanEye },
        ],
    },
    {
        name: 'DevOps & infrastructure',
        span: 4,
        items: [
            { name: 'Linux', icon: SiLinux },
            { name: 'Docker', icon: SiDocker },
            { name: 'Git', icon: SiGit },
            { name: 'GitHub', icon: SiGithub },
        ],
    },
    {
        name: 'Tools & workflow',
        span: 4,
        items: [
            { name: 'VS Code', icon: VscVscode },
            { name: 'n8n', icon: SiN8N },
            { name: 'Google Sheets', icon: SiGooglesheets },
        ],
    },
    {
        name: 'CS foundations',
        span: 6,
        items: [
            { name: 'Data structures & algorithms', icon: Binary },
            { name: 'Object-oriented programming', icon: Boxes },
            { name: 'Problem solving', icon: Puzzle },
            { name: 'Open-source contribution', icon: GitPullRequest },
        ],
    },
];
