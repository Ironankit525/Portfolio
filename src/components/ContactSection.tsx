"use client";
import React, { useState } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Twitter, Linkedin, Github } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-[#C3E41D] text-black hover:bg-[#a3bd18]",
                destructive: "bg-red-500 text-white hover:bg-red-500/90",
                outline: "border border-input bg-background hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-black dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50",
                ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
                link: "text-[#C3E41D] underline-offset-4 hover:underline",
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
)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 dark:text-gray-100",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Textarea.displayName = "Textarea"
const labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300")
const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>>(
    ({ className, ...props }, ref) => (
        <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
        />
    )
)
Label.displayName = LabelPrimitive.Root.displayName
const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>>(
    ({ className, ...props }, ref) => (
        <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                className
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current")}>
                <Check className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    )
)
Checkbox.displayName = CheckboxPrimitive.Root.displayName
interface ContactSectionProps {
    title?: string;
    mainMessage?: string;
    contactEmail?: string;
    socialLinks?: Array<{ id: string; name: string; icon: React.ReactNode; href: string }>;
    backgroundImageSrc?: string;
    onSubmit?: (data: any) => void;
}
const defaultSocialLinks = [
    { id: '1', name: 'X', icon: <Twitter className="h-4 w-4" />, href: '#x' },
    { id: '2', name: 'GitHub', icon: <Github className="h-4 w-4" />, href: 'https://github.com/Ironankit525' },
    { id: '3', name: 'LinkedIn', icon: <Linkedin className="h-4 w-4" />, href: 'https://www.linkedin.com/in/ankit-kumar525' },
];
export default function ContactSection({
    title = "Let's turn your idea into reality",
    mainMessage = "Let's talk! 👋",
    contactEmail = "hello@pixelperfect.com",
    socialLinks = defaultSocialLinks,
    onSubmit,
}: ContactSectionProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        try {
            const response = await fetch("https://formspree.io/f/mdalqlkj", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', message: '' });
                onSubmit?.(formData);
                setTimeout(() => setStatus('idle'), 3000); 
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Form submission error:", error);
            setStatus('error');
        }
    };
    return (
        <section id="contact" className="relative min-h-screen w-full overflow-hidden bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white font-sans transition-colors duration-500">
            {}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-neutral-400 dark:bg-white animate-twinkle"
                        style={{
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 3 + 2}s`,
                        }}
                    />
                ))}
            </div>
            {}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div
                        key={`shoot-${i}`}
                        className="animate-shooting-star absolute bg-gradient-to-r from-transparent via-neutral-400 dark:via-white to-transparent rounded-full"
                        style={{
                            width: `${Math.random() * 80 + 60}px`,
                            height: `${Math.random() * 1 + 1.5}px`,
                            top: `${Math.random() * 80}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 12}s`,
                            animationDuration: `${Math.random() * 3.45 + 12}s`,
                        }}
                    />
                ))}
            </div>
            {}
            <div className="relative z-10 flex flex-col items-center justify-center w-full min-h-screen p-4 md:p-8 lg:p-12">
                {}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full max-w-7xl rounded-xl flex-grow items-center">
                    {}
                    <div className="flex flex-col justify-center p-4 lg:p-8 h-full">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-neutral-900 dark:text-gray-100 leading-tight drop-shadow-sm">
                            {title}
                        </h1>
                        <p className="mt-6 text-lg text-neutral-600 dark:text-gray-400 max-w-md">
                            I’m always open to collaborating on impactful projects, open-source contributions, or innovative AI ideas. Whether you have a project in mind or just want to connect — I’d love to hear from you.
                        </p>
                        {}
                        <div className="mt-12 flex items-center gap-4">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    className="p-3 bg-neutral-200 dark:bg-zinc-900 rounded-full hover:bg-neutral-300 dark:hover:bg-zinc-800 transition-colors text-neutral-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-500"
                                    aria-label={link.name}
                                    title={link.name}
                                >
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    {}
                    <div className="bg-neutral-200 dark:bg-zinc-950 p-6 md:p-8 lg:p-10 rounded-2xl shadow-xl border border-neutral-200 dark:border-zinc-800 w-full relative overflow-hidden">
                        {}
                        <div className="absolute top-[-50px] right-[-50px] w-[150px] h-[150px] bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-gray-100 mb-2 relative z-10">{mainMessage}</h2>
                        {}
                        <div className="mb-8 relative z-10">
                            <p className="text-neutral-500 dark:text-gray-400 mb-1 text-sm font-medium">Mail me</p>
                            <a href={`mailto:${contactEmail}`} className="text-[#C3E41D] dark:text-[#C3E41D] hover:underline font-semibold text-lg">
                                {contactEmail}
                            </a>
                        </div>
                        <hr className="my-8 border-neutral-200 dark:border-zinc-800 relative z-10" />
                        {}
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <p className="text-neutral-900 dark:text-gray-100 font-semibold">Send me a message</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Your name</Label>
                                    <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Briefly describe your project idea</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    placeholder="Tell me about your project, goals, or just say hello..."
                                    className="min-h-[120px] resize-none"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full mt-4 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
                            </Button>
                            {status === 'success' && (
                                <p className="text-sm text-green-600 dark:text-green-500 text-center mt-2">
                                    Thank you! Your message has been sent successfully.
                                </p>
                            )}
                            {status === 'error' && (
                                <p className="text-sm text-red-600 dark:text-red-500 text-center mt-2">
                                    Oops! Something went wrong. Please try again.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }
        .animate-twinkle {
          animation: twinkle var(--animation-duration, 3s) ease-in-out infinite;
        }
        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0) rotate(-35deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          15% {
            transform: translateX(-300px) translateY(200px) rotate(-35deg);
            opacity: 0;
          }
          100% {
            transform: translateX(-300px) translateY(200px) rotate(-35deg);
            opacity: 0;
          }
        }
        .animate-shooting-star {
          animation: shooting 6s ease-in-out infinite;
        }
      `}</style>
        </section>
    );
}
