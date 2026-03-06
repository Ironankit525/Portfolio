import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronDown, MoonStarIcon, SunIcon } from "lucide-react";
import { motion } from "framer-motion";
import LiquidEffectAnimation from "./components/LiquidEffectAnimation";
const Button = React.forwardRef(({ className = "", children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
);
Button.displayName = "Button";
const BlurText = ({
  text,
  delay = 50,
  animateBy = "words",
  direction = "top",
  className = "",
  style,
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  const segments = useMemo(() => {
    return animateBy === "words" ? text.split(" ") : text.split("");
  }, [text, animateBy]);
  return (
    <p ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {segments.map((segment, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            filter: inView ? "blur(0px)" : "blur(10px)",
            opacity: inView ? 1 : 0,
            transform: inView
              ? "translateY(0)"
              : `translateY(${direction === "top" ? "-20px" : "20px"})`,
            transition: `all 0.5s ease-out ${i * delay}ms`,
          }}
        >
          {segment}
          {animateBy === "words" && i < segments.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </p>
  );
};
function PortfolioHero() {
  const [theme, setTheme] = useState < 'light' | 'dark' > ('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);
  const handleThemeChange = (newTheme) => {
    if (theme === newTheme) return;
    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
    });
    transition.ready.then(() => {
      const x = window.innerWidth;
      const y = 0;
      const endRadius = Math.hypot(window.innerWidth, window.innerHeight);
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className="min-h-screen transition-colors overflow-hidden bg-gray-50 dark:bg-black text-gray-900 dark:text-white"
    >
      { }
      <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-6 w-full transition-all duration-300 ${isScrolled ? "bg-white/70 dark:bg-black/70 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"}`}>
        <nav className="flex items-center justify-between max-w-screen-2xl mx-auto font-mono">
          { }
          <div className="flex items-center text-gray-900 dark:text-white text-[18px] font-medium">
            <span className="tracking-tight">Ankit</span>
          </div>
          { }
          <div className="hidden md:flex items-center gap-12 text-[14px] text-gray-700 dark:text-gray-300">
            <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">About</a>
            <a href="#projects" className="hover:text-black dark:hover:text-white transition-colors">Projects</a>
            <a href="#integrations" className="hover:text-black dark:hover:text-white transition-colors">Integrations</a>
            <a href="#contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
          </div>
          { }
          <div className="flex items-center gap-4 flex-wrap">
            <a href="https://github.com/Ironankit525" target="_blank" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-2 rounded-full inline-flex items-center justify-center transition-all duration-200 hover:bg-black dark:hover:bg-gray-200 hover:scale-105" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/ankit-kumar525/" target="_blank" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-2 rounded-full inline-flex items-center justify-center transition-all duration-200 hover:bg-black dark:hover:bg-gray-200 hover:scale-105" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect width="4" height="12" x="2" y="9"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            { }
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-800 ml-2"
              role="radiogroup"
            >
              <button
                className={`relative flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors [&_svg]:size-4 ${theme === 'light' ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"}`}
                role="radio"
                aria-checked={theme === 'light'}
                aria-label="Switch to light theme"
                onClick={() => handleThemeChange('light')}
              >
                <span className="relative z-10"><SunIcon /></span>
                {theme === 'light' && (
                  <motion.div
                    layoutId="theme-option"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className="absolute inset-0 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                )}
              </button>
              <button
                className={`relative flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors [&_svg]:size-4 ${theme === 'dark' ? "text-zinc-950 dark:text-zinc-50" : "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"}`}
                role="radio"
                aria-checked={theme === 'dark'}
                aria-label="Switch to dark theme"
                onClick={() => handleThemeChange('dark')}
              >
                <span className="relative z-10"><MoonStarIcon /></span>
                {theme === 'dark' && (
                  <motion.div
                    layoutId="theme-option"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className="absolute inset-0 rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800"
                  />
                )}
              </button>
            </motion.div>
          </div>
        </nav>
      </header>
      { }
      <main className="relative z-0 min-h-screen flex flex-col">
        { }
        <LiquidEffectAnimation
          imageUrl="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2560&auto=format&fit=crop"
          metalness={0.9}
          roughness={0.15}
        />
        { }
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4">
          <div className="relative text-center flex flex-col items-center">
            <div className="z-0 relative">
              <BlurText
                text="ANKIT"
                delay={100}
                animateBy="letters"
                direction="top"
                className="font-bold text-[120px] sm:text-[160px] md:text-[220px] lg:text-[260px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }}
              />
            </div>
            <div className="z-0 relative">
              <BlurText
                text="KUMAR"
                delay={100}
                animateBy="letters"
                direction="top"
                className="font-bold text-[120px] sm:text-[160px] md:text-[220px] lg:text-[260px] leading-[0.75] tracking-tighter uppercase justify-center whitespace-nowrap"
                style={{ color: "#C3E41D", fontFamily: "'Fira Code', monospace" }}
              />
            </div>
            { }
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <div className="w-[120px] h-[180px] sm:w-[160px] sm:h-[240px] md:w-[200px] md:h-[300px] lg:w-[240px] lg:h-[360px] rounded-full overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-110 cursor-pointer pointer-events-auto ring-4 ring-transparent hover:ring-[#C3E41D]/30">
                <img
                  src="src/assets/unwatermarked_Gemini_Generated_Image_y3h8v4y3h8v4y3h8.png"
                  alt="Ankit Kumar Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        { }
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-32 left-1/2 -translate-x-1/2 w-full px-6">
          <div className="flex flex-col justify-center items-center">
            <BlurText
              text="Building intelligent systems and scalable web experiences."
              delay={150}
              animateBy="words"
              direction="top"
              className="text-[15px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center transition-colors duration-300 text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white"
              style={{ fontFamily: "'Antic', sans-serif" }}
            />
            <BlurText
              text="AI-focused developer and problem solver passionate about automation, open source, and building impactful digital products."
              delay={200}
              animateBy="words"
              direction="top"
              className="mt-4 text-[13px] sm:text-[15px] md:text-[17px] lg:text-[19px] text-center transition-colors duration-300 text-neutral-500 hover:text-neutral-300 dark:text-neutral-500 dark:hover:text-neutral-300 max-w-2xl mx-auto"
              style={{ fontFamily: "'Antic', sans-serif" }}
            />
          </div>
        </div>
        { }
        <button
          type="button"
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 transition-colors duration-300 animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white transition-colors duration-300" />
        </button>
      </main>
    </div>
  );
}
import AboutSection1 from "./components/AboutSection";
import FeaturedProjectsSection from "./components/FeaturedProjectsSection";
import IntegrationSection from "./components/IntegrationSection";
import ContactSection from "./components/ContactSection";
import ProjectGallery from "./components/ProjectGallery";
import armCover from "./assets/Screenshot 2026-03-06 at 5.57.37 AM.png";
const demoData = [
  {
    id: "arm-ecommerce",
    title: "ARM E-Commerce Platform",
    description: "A full-stack e-commerce application with product management, authentication, and scalable backend architecture. Designed for performance and clean UI/UX.",
    href: "#/project/arm-ecommerce",
    image: armCover,
    tags: ["React", "Node.js", "Full-Stack", "E-Commerce"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: "ai-workflow",
    title: "AI Workflow Automation System",
    description: "Automated content generation pipeline using n8n and Google Sheets for structured voice and image prompt generation. Focused on scalable automation design.",
    href: "#",
    image: "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?auto=format&fit=crop&q=80&w=600",
    tags: ["n8n", "AI", "Automation", "Workflow"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
  {
    id: "open-source",
    title: "Open Source Contributions",
    description: "Actively contributing to open-source projects with focus on clean architecture, issue resolution, and performance improvements.",
    href: "#",
    image: "https://images.unsplash.com/photo-1536735561749-fc87494598cb?auto=format&fit=crop&q=80&w=600",
    tags: ["Open Source", "Architecture", "Performance"],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com"
  },
];
export default function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);
  useEffect(() => {
    const handleHashChange = () => setCurrentRoute(window.location.hash);
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  if (currentRoute === "#/project/arm-ecommerce") {
    return <ProjectGallery />;
  }
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@700&family=Antic&display=swap');
          `,
        }}
      />
      <div className="w-full font-sans">
        <PortfolioHero />
        <AboutSection1 />
        <FeaturedProjectsSection
          title="Featured Projects"
          description="Selected projects demonstrating my experience in AI systems, automation, and full-stack development."
          items={demoData}
        />
        <IntegrationSection />
        <ContactSection
          title="Let’s Build Something Meaningful"
          mainMessage="Let's Build Something Amazing Together 🚀"
          contactEmail="ankitkumar17541@gmail.com"
        />
      </div>
    </>
  );
}
