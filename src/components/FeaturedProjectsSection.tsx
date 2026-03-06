import React, { useEffect, useState, useCallback, forwardRef, createContext, useContext } from "react";
import { ArrowLeft, ArrowRight, Github } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
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
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = "Button";
type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];
type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: "horizontal" | "vertical";
    setApi?: (api: CarouselApi) => void;
};
type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} & CarouselProps;
const CarouselContext = createContext<CarouselContextProps | null>(null);
function useCarousel() {
    const context = useContext(CarouselContext);
    if (!context) throw new Error("useCarousel must be used within a <Carousel />");
    return context;
}
const Carousel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & CarouselProps>(
    ({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
        const [carouselRef, api] = useEmblaCarousel(
            { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
            plugins
        );
        const [canScrollPrev, setCanScrollPrev] = useState(false);
        const [canScrollNext, setCanScrollNext] = useState(false);
        const onSelect = useCallback((api: CarouselApi) => {
            if (!api) return;
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);
        const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
        const scrollNext = useCallback(() => api?.scrollNext(), [api]);
        useEffect(() => {
            if (!api || !setApi) return;
            setApi(api);
        }, [api, setApi]);
        useEffect(() => {
            if (!api) return;
            onSelect(api);
            api.on("reInit", onSelect);
            api.on("select", onSelect);
            return () => { api?.off("select", onSelect); };
        }, [api, onSelect]);
        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api,
                    opts,
                    orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext,
                }}
            >
                <div
                    ref={ref}
                    className={cn("relative", className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    }
);
Carousel.displayName = "Carousel";
const CarouselContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { carouselRef, orientation } = useCarousel();
        return (
            <div ref={carouselRef} className="overflow-hidden">
                <div
                    ref={ref}
                    className={cn(
                        "flex",
                        orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
                        className
                    )}
                    {...props}
                />
            </div>
        );
    }
);
CarouselContent.displayName = "CarouselContent";
const CarouselItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const { orientation } = useCarousel();
        return (
            <div
                ref={ref}
                role="group"
                aria-roledescription="slide"
                className={cn(
                    "min-w-0 shrink-0 grow-0 basis-full",
                    orientation === "horizontal" ? "pl-4" : "pt-4",
                    className
                )}
                {...props}
            />
        );
    }
);
CarouselItem.displayName = "CarouselItem";
export interface Gallery4Item {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
    linkText?: string;
    tags?: string[];
    githubUrl?: string;
    liveUrl?: string;
}
export interface Gallery4Props {
    title?: string;
    description?: string;
    items: Gallery4Item[];
}
export default function FeaturedProjectsSection({
    title = "Featured Projects",
    description = "A selection of case studies highlighting our work with modern web technologies and frameworks.",
    items = [],
}: Gallery4Props) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        if (!carouselApi) return;
        const updateSelection = () => {
            setCanScrollPrev(carouselApi.canScrollPrev());
            setCanScrollNext(carouselApi.canScrollNext());
            setCurrentSlide(carouselApi.selectedScrollSnap());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => { carouselApi.off("select", updateSelection); };
    }, [carouselApi]);
    return (
        <section id="projects" className="py-20 dark:bg-zinc-900 bg-white text-gray-900 dark:text-gray-100">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-8 flex items-end justify-between md:mb-14">
                    <div className="flex flex-col gap-4">
                        <div className="text-[#C3E41D] text-sm font-semibold uppercase flex items-center gap-2">
                            Projects
                        </div>
                        <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl tracking-tight">
                            {title}
                        </h2>
                        <p className="max-w-lg text-gray-600 dark:text-gray-400">{description}</p>
                    </div>
                    <div className="hidden shrink-0 gap-2 md:flex">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => carouselApi?.scrollPrev()}
                            disabled={!canScrollPrev}
                            className="rounded-full border-gray-300 dark:border-gray-700 bg-transparent hover:bg-[#C3E41D]/20 hover:text-[#a3bd18] dark:hover:bg-[#C3E41D]/20 dark:hover:text-[#C3E41D] text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => carouselApi?.scrollNext()}
                            disabled={!canScrollNext}
                            className="rounded-full border-gray-300 dark:border-gray-700 bg-transparent hover:bg-[#C3E41D]/20 hover:text-[#a3bd18] dark:hover:bg-[#C3E41D]/20 dark:hover:text-[#C3E41D] text-gray-700 dark:text-gray-300 transition-colors"
                        >
                            <ArrowRight className="size-5" />
                        </Button>
                    </div>
                </div>
                <div className="w-full">
                    <Carousel
                        setApi={setCarouselApi}
                        opts={{
                            align: "start",
                            loop: false,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="ml-0">
                            {items.map((item) => (
                                <CarouselItem
                                    key={item.id}
                                    className="basis-full sm:basis-1/2 md:basis-1/3 pl-4"
                                >
                                    <div className="group flex flex-col h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121212] overflow-hidden transition-all hover:shadow-xl">
                                        <a href={item.href} target={item.href !== "#" ? "_blank" : "_self"} rel="noopener noreferrer" className="block relative w-full aspect-video overflow-hidden border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            {item.href !== "#" && (
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                                    <span className="opacity-0 group-hover:opacity-100 text-white font-medium bg-black/60 px-4 py-2 rounded-full backdrop-blur-md transition-opacity duration-300">View Project</span>
                                                </div>
                                            )}
                                        </a>
                                        <div className="p-6 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{item.title}</h3>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 flex-grow">{item.description}</p>
                                            {item.tags && item.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {item.tags.map((tag, i) => (
                                                        <span key={i} className="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-100 dark:bg-[#202020] text-zinc-800 dark:text-zinc-300">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex flex-col sm:flex-row items-center gap-3 mt-auto">
                                                <a href={item.githubUrl || "#"} className="w-full sm:w-auto flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-[#C3E41D]/50 bg-[#C3E41D]/10 text-[#a3bd18] dark:text-[#C3E41D] dark:hover:bg-[#C3E41D]/20 hover:bg-[#C3E41D]/20 transition-colors">
                                                    <Github className="w-4 h-4" /> Github
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    {}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <div className="flex gap-2">
                            {items.map((_, index) => (
                                <button
                                    key={index}
                                    className={cn(
                                        "h-2 rounded-full transition-all duration-300",
                                        currentSlide === index ? "w-8 bg-[#C3E41D]" : "w-2 bg-[#C3E41D]/20"
                                    )}
                                    onClick={() => carouselApi?.scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
