"use client";
import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
    BrainCircuit,
    Code2,
    GitCommit,
    GitPullRequest,
    Workflow,
} from "lucide-react";
import {
    SiJavascript,
    SiHtml5,
    SiCss,
    SiReact,
    SiFigma,
    SiPython,
    SiRust,
    SiGo,
    SiLinux,
    SiDocker,
    SiKubernetes,
    SiMongodb,
    SiN8N,
} from "react-icons/si";
import { FaJava, FaGitAlt, FaGithub } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { SiGooglesheets } from "react-icons/si";
import { ShieldCheck, Server, Cpu } from "lucide-react";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90",
                destructive: "bg-red-500 text-white hover:bg-red-500/90",
                outline: "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-black dark:hover:bg-gray-800 dark:hover:text-gray-50",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50",
                ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                link: "text-blue-500 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);
const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
const CORE_TECH_STACK = [
    {
        category: "Frontend",
        items: [
            { name: "JavaScript", icon: SiJavascript, color: "group-hover:text-[#F7DF1E]" },
            { name: "HTML5", icon: SiHtml5, color: "group-hover:text-[#E34F26]" },
            { name: "CSS3", icon: SiCss, color: "group-hover:text-[#1572B6]" },
            { name: "React", icon: SiReact, color: "group-hover:text-[#61DAFB]" },
            { name: "Figma", icon: SiFigma, color: "group-hover:text-[#F24E1E]" },
        ],
    },
    {
        category: "Backend & Programming",
        items: [
            { name: "Java", icon: FaJava, color: "group-hover:text-[#007396]" },
            { name: "Python", icon: SiPython, color: "group-hover:text-[#3776AB]" },
            { name: "Rust", icon: SiRust, color: "group-hover:text-[#000000] dark:group-hover:text-white" },
            { name: "Golang", icon: SiGo, color: "group-hover:text-[#00ADD8]" },
        ],
    },
    {
        category: "DevOps & Infrastructure",
        items: [
            { name: "Linux", icon: SiLinux, color: "group-hover:text-[#FCC624]" },
            { name: "Docker", icon: SiDocker, color: "group-hover:text-[#2496ED]" },
            { name: "Kubernetes", icon: SiKubernetes, color: "group-hover:text-[#326CE5]" },
        ],
    },
    {
        category: "Databases & Data Handling",
        items: [
            { name: "MongoDB", icon: SiMongodb, color: "group-hover:text-[#47A248]" },
            { name: "Google Sheets", icon: SiGooglesheets, color: "group-hover:text-[#34A853]" },
        ],
    },
    {
        category: "Tools & Workflow",
        items: [
            { name: "Git", icon: FaGitAlt, color: "group-hover:text-[#F05032]" },
            { name: "GitHub", icon: FaGithub, color: "group-hover:text-[#181717] dark:group-hover:text-white" },
            { name: "VS Code", icon: VscVscode, color: "group-hover:text-[#007ACC]" },
            { name: "n8n", icon: SiN8N, color: "group-hover:text-[#FF6D5A]" },
        ],
    },
    {
        category: "Computer Science Foundations",
        items: [
            { name: "DSA", icon: BrainCircuit, color: "group-hover:text-purple-500" },
            { name: "OOP", icon: Code2, color: "group-hover:text-blue-500" },
            { name: "Problem Solving", icon: Workflow, color: "group-hover:text-green-500" },
            { name: "Version Control", icon: GitCommit, color: "group-hover:text-yellow-500" },
            { name: "Open Source", icon: GitPullRequest, color: "group-hover:text-orange-500" },
        ],
    },
];
const EXPLORING_TECH = [
    { name: "Cybersecurity Basics", icon: ShieldCheck, color: "group-hover:text-red-500" },
    { name: "Backend Systems Design", icon: Server, color: "group-hover:text-indigo-500" },
    { name: "GC-aware Memory", icon: Cpu, color: "group-hover:text-teal-500" },
    { name: "Golang", icon: SiGo, color: "group-hover:text-[#00ADD8]" },
];
export default function IntegrationSection() {
    return (
        <section id="integrations" className="relative py-32 overflow-hidden bg-white dark:bg-zinc-950 w-full min-h-screen flex items-center">
            { }
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]" />
            { }
            <div className="relative max-w-7xl mx-auto px-6 w-full">
                <div className="text-center mb-16">
                    <span className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-black dark:text-white shadow-sm">
                        ⚡ SKILLS & TOOLS
                    </span>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                        Technologies I Work With
                    </h1>
                    <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                        A categorized breakdown of the tools, languages, and frameworks I use to build robust and scalable systems.
                    </p>
                </div>
                { }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {CORE_TECH_STACK.map((category, idx) => (
                        <div key={idx} className="flex flex-col p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-6">
                                {category.category}
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {category.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700"
                                    >
                                        <item.icon className={cn("w-8 h-8 mb-3 text-zinc-600 dark:text-zinc-400 transition-colors duration-300", item.color)} />
                                        <span className="text-xs font-medium text-center text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                            {item.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                { }
                <div className="relative p-8 rounded-3xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/50">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 text-center md:text-left">
                        <div>
                            <span className="inline-block px-3 py-1 mb-3 text-xs font-bold uppercase tracking-wider rounded-full bg-[#C3E41D]/10 text-[#C3E41D] dark:bg-[#C3E41D]/20 dark:text-[#C3E41D]">
                                In Progress
                            </span>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                🚀 Currently Exploring
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl">
                                Actively learning and building projects around these concepts to expand my technical depth.
                            </p>
                        </div>
                        <Button className="shrink-0 rounded-full shadow-md bg-[#C3E41D] text-black hover:bg-[#a3bd18] dark:bg-[#C3E41D] dark:text-black dark:hover:bg-[#a3bd18]">
                            View Learning Log →
                        </Button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {EXPLORING_TECH.map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                                <div className="shrink-0 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                                    <item.icon className={cn("w-6 h-6 text-zinc-600 dark:text-zinc-400 transition-colors duration-300", item.color)} />
                                </div>
                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}</style>
        </section>
    );
}
