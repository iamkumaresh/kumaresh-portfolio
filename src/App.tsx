import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink, Menu, X, ChevronUp, Send, CheckCircle, Loader2, Instagram, Facebook, Phone } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { certificatesData, Certificate } from "./data/certificates";

// --- HIGH-PERFORMANCE CUSTOM CURSOR COMPONENT ---
const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState<"" | "cta" | "project" | "external" | "nav" | "hide">("");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preferences
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    // Disable custom cursor entirely on mobile/tablet coarse pointer viewports
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Let standard browser caret handle inputs/textareas for superior text insertion UX
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        setHoverType("hide");
        return;
      }

      const cursorTarget = target.closest("[data-cursor]");
      const isNav = target.closest("nav a") || target.closest("header a") || target.closest("button") || target.closest("a");
      
      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor") as any;
        setHoverType(type || "");
      } else if (isNav) {
        setHoverType("nav");
      } else {
        setHoverType("");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);

    let animationFrameId: number;
    const tick = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      // Interpolate position - bypass transition lag if reducedMotion is true
      const speed = reducedMotion ? 1 : 0.15;
      followerPos.current.x += (mousePos.current.x - followerPos.current.x) * speed;
      followerPos.current.y += (mousePos.current.y - followerPos.current.y) * speed;
      
      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${followerPos.current.x}px, ${followerPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      animationFrameId = requestAnimationFrame(tick);
    };
    
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      motionQuery.removeEventListener("change", motionListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <>
      {/* Primary Dot */}
      <div 
        ref={dotRef}
        className={`fixed top-0 left-0 w-1.5 h-1.5 bg-[#D7FF3F] rounded-full pointer-events-none z-[9999] select-none transition-opacity duration-200 ${hoverType === "hide" ? "opacity-0" : "opacity-100"}`}
      />
      {/* Secondary Follower Ring */}
      <div 
        ref={followerRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9998] transition-[width,height,border-color,background-color,border-radius,opacity] duration-300 ease-out flex items-center justify-center text-[9px] font-mono font-bold tracking-wider select-none
          ${hoverType === "hide" ? "w-0 h-0 opacity-0" :
            hoverType === "project" ? "w-16 h-16 bg-[#D7FF3F] text-[#050505] border-transparent opacity-100" :
            hoverType === "external" ? "w-16 h-16 bg-[#D7FF3F] text-[#050505] border-transparent opacity-100" :
            hoverType === "cta" ? "w-10 h-10 border border-[#D7FF3F]/40 bg-[#D7FF3F]/5 opacity-100" :
            hoverType === "nav" ? "w-8 h-8 border border-[#D7FF3F]/40 bg-[#D7FF3F]/5 opacity-100" :
            "w-6 h-6 border border-[#777777]/30 bg-transparent opacity-100"
          }`}
      >
        {hoverType === "project" && "VIEW"}
        {hoverType === "external" && "OPEN"}
      </div>
    </>
  );
};

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sections = ["home", "about", "education", "skills", "projects", "certifications", "contact"];
    
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px", // Middle screen focus range
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Focus trap and Escape key handler to close mobile overlay menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusable = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "ABOUT", href: "#about" },
    { name: "EDUCATION", href: "#education" },
    { name: "SKILLS", href: "#skills" },
    { name: "PROJECTS", href: "#projects" },
    { name: "CERTIFICATIONS", href: "#certifications" },
    { name: "CONTACT", href: "#contact" },
  ];

  return (
    <header>
      {/* Desktop Brand Wordmark / Monogram - Far Left */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay: 0.10 }}
        className="fixed top-8 left-6 md:left-8 lg:left-12 z-50 hidden md:flex items-center"
      >
        <a 
          href="#home" 
          aria-label="Kumaresh Jana Homepage"
          className="group flex items-center gap-2 px-3.5 bg-white/[0.03] backdrop-blur-[18px] border border-white/[0.08] hover:border-[#D7FF3F]/40 hover:shadow-[0_0_15px_rgba(215,255,63,0.15)] hover:scale-[1.03] active:scale-[0.96] rounded-md h-[40px] transition-all duration-200 select-none"
        >
          <span className="font-display font-extrabold text-sm tracking-tight text-[#F4F2ED] group-hover:text-[#D7FF3F] transition-colors">
            KJ<span className="text-[#D7FF3F]">.</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#777777] uppercase hidden lg:inline-block border-l border-white/[0.1] pl-2">
            PORTFOLIO
          </span>
        </a>
      </motion.div>

      {/* Floating Center Navbar (Desktop - Stagger: 100ms) */}
      <motion.nav 
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay: 0.10 }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div className="bg-white/[0.03] backdrop-blur-[18px] px-6 py-2 flex items-center justify-between border border-white/[0.08] rounded-md h-[40px]">
          <div className="flex gap-5 items-center text-[10px] font-mono font-medium tracking-[0.15em]">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-all duration-150 active:scale-[0.96] group flex flex-col items-center ${
                  activeSection === link.href.slice(1) ? "text-[#D7FF3F]" : "text-[#777777] hover:text-[#F4F2ED]"
                }`}
              >
                <span>{link.name}</span>
                {/* Subtle hover underline scale-x */}
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F4F2ED]/40 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out" />
                {/* Active Section Dot */}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#D7FF3F] shadow-[0_0_8px_#D7FF3F]" />
                )}
              </a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Open to Work Status Indicator & Menu Trigger - Top Right (Stagger: 100ms) */}
      <motion.div 
        initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut", delay: 0.10 }}
        className="fixed top-6 right-6 md:top-8 md:right-8 z-50 flex items-center gap-2"
      >
        <div className="hidden sm:flex items-center gap-2 relative py-2 mr-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D7FF3F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#D7FF3F] shadow-[0_0_12px_rgba(215,255,63,0.35)]"></span>
          </span>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#F4F2ED] font-semibold">OPEN TO WORK</span>
        </div>

        {/* Mobile Menu Trigger (Translucent glass styling, h-44px target) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-[100px] h-[44px] bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.10] text-[#F4F2ED] md:hidden shadow-lg text-[10px] font-mono tracking-widest hover:border-[#D7FF3F]/30 hover:scale-[1.03] active:scale-[0.97] uppercase flex items-center justify-center gap-1.5 select-none rounded-[6px] transition-all duration-200 cursor-pointer"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <>CLOSE <X size={12} /></>
          ) : (
            <>MENU ≡</>
          )}
        </button>
      </motion.div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation"
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-[#050505]/98 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-center">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? { duration: 0 } : { delay: i * 0.05 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-2xl font-display font-bold tracking-wider active:scale-[0.96] transition-transform duration-150 ${activeSection === link.href.slice(1) ? "text-[#D7FF3F]" : "text-[#F4F2ED]"}`}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-4 text-center">
              <span className="text-meta text-[10px] text-[#777777]">LET'S CONNECT</span>
              <div className="flex gap-4">
                <a href="https://github.com/iamkumaresh" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Github size={18} /></a>
                <a href="https://www.linkedin.com/in/kumaresh-jana-050406k" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Linkedin size={18} /></a>
                <a href="https://www.instagram.com/_kumares_h" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Instagram size={18} /></a>
                <a href="https://www.facebook.com/share/18MBiWw7D3/" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Facebook size={18} /></a>
                <a href="mailto:kumaresh2106@gmail.com" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Mail size={18} /></a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- TYPING BIO COMPONENT (Continuous typing loop with accessibility checks) ---
const TypingBio = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const text = "I build digital experiences that are fast, accessible and visually refined. Turning ideas into impactful solutions.";
  const tokens = [
    { text: "I build digital experiences that are ", highlight: false },
    { text: "fast", highlight: true },
    { text: ", accessible and visually ", highlight: false },
    { text: "refined", highlight: true },
    { text: ". Turning ideas into impactful solutions.", highlight: false }
  ];

  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(30);

  useEffect(() => {
    if (reducedMotion) return;

    let timer: any;
    const handleType = () => {
      if (!isDeleting) {
        setCharIndex((prev) => {
          if (prev >= text.length) {
            timer = setTimeout(() => {
              setIsDeleting(true);
            }, 3000); // Hold static text for 3 seconds before deleting
            return prev;
          }
          setTypingSpeed(30); // Speed of typing
          return prev + 1;
        });
      } else {
        setCharIndex((prev) => {
          if (prev <= 0) {
            timer = setTimeout(() => {
              setIsDeleting(false);
            }, 500); // Brief pause before typing next loop
            return 0;
          }
          setTypingSpeed(15); // Fast delete speed
          return prev - 1;
        });
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingSpeed, reducedMotion, text.length]);

  if (reducedMotion) {
    return (
      <>
        I build digital experiences that are <span className="text-[#D7FF3F]">fast</span>, accessible and visually <span className="text-[#D7FF3F]">refined</span>. Turning ideas into impactful solutions.
      </>
    );
  }

  let remaining = charIndex;
  return (
    <>
      {tokens.map((token, idx) => {
        if (remaining <= 0) return null;
        const sliceLength = Math.min(token.text.length, remaining);
        const slicedText = token.text.substring(0, sliceLength);
        remaining -= sliceLength;

        return (
          <span 
            key={idx} 
            className={token.highlight ? "text-[#D7FF3F] font-medium" : ""}
          >
            {slicedText}
          </span>
        );
      })}
      {/* Premium pulsing inline cursor — pauses when reduced motion is preferred */}
      <span className={`inline-block w-[1.5px] h-[1.1em] bg-[#D7FF3F] ml-1 align-middle motion-reduce:animate-none ${
        reducedMotion ? "opacity-80" : "animate-[pulse_1s_infinite]"
      }`} />
    </>
  );
};

// --- HERO SECTION COMPONENT (Cinematic Editorial Poster) ---
const Hero = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Parallax element references
  const nameRef = useRef<HTMLHeadingElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // High-performance lerp coordinates (bypasses React state updates)
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
    const motionListener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener("change", motionListener);

    // Disable real-time mouse move parallax on mobile/tablet coarse viewports or reduced-motion
    if (window.innerWidth < 1024 || motionQuery.matches || window.matchMedia("(pointer: coarse)").matches) {
      return () => {
        motionQuery.removeEventListener("change", motionListener);
      };
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Scale coordinates between -1.0 and 1.0
      mouseTarget.current.x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      mouseTarget.current.y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const tick = () => {
      const ease = 0.08; // Lerp easing weight
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * ease;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * ease;

      const { x, y } = mouseCurrent.current;

      // Transform DOM styles directly at 60fps/120fps with zero layout shifts or lag
      if (nameRef.current) {
        nameRef.current.style.transform = `translate3d(${x * 1.8}px, ${y * 1.8}px, 0)`;
      }
      if (orbitRef.current) {
        orbitRef.current.style.transform = `translate3d(${x * 3.0}px, ${y * 3.0}px, 0)`;
      }
      if (portraitRef.current) {
        portraitRef.current.style.transform = `translate3d(${x * 8.0}px, ${y * 8.0}px, 0)`; // 8px maximum translation for cinematic depth
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${x * 1.0}px, ${y * 1.0}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      motionQuery.removeEventListener("change", motionListener);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section id="home" className="min-h-[100svh] w-full relative flex items-center overflow-hidden bg-[#050505] px-6 sm:px-12 md:px-16 lg:px-24">
      {/* Mobile Atmospheric Light (Centered behind mobile portrait) */}
      <div 
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.015) 0%, transparent 60%)",
        }}
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] pointer-events-none z-0 md:hidden"
      />

      {/* Desktop Atmospheric Light (Centered behind portrait container - Lerp: 1.0px) */}
      <div 
        ref={bgRef}
        className="absolute right-[4%] xl:right-[5.5%] top-[40%] -translate-y-1/2 w-[36%] lg:w-[42%] xl:w-[48%] flex justify-center items-center pointer-events-none z-0 hidden md:flex transition-transform duration-300 ease-out"
      >
        <div 
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.015) 0%, transparent 60%)",
          }}
          className="w-[600px] h-[600px] shrink-0"
        />
      </div>

      {/* Background Subtle Arc Halo (Desktop - layering: behind portrait) */}
      <div className="absolute top-[40%] right-[10%] -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] border border-[#D7FF3F]/20 rounded-full opacity-[0.10] blur-[8px] pointer-events-none z-0 hidden md:block" />
      <div className="absolute top-[40%] right-[10%] -translate-y-1/2 w-[340px] h-[340px] sm:w-[440px] sm:h-[440px] border-2 border-[#D7FF3F]/10 rounded-full opacity-[0.05] pointer-events-none z-0 animate-pulse hidden md:block" />
      
      {/* Mobile Background Subtle Orbit Circle (Rotates slowly - opacity: 0.10, border: 1px solid 10% lime) */}
      <div 
        style={{
          width: "108vw",
          height: "108vw",
          animation: reducedMotion ? "none" : "spin 38s linear infinite",
        }}
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 border border-[#D7FF3F]/10 rounded-full opacity-10 pointer-events-none z-0 md:hidden"
      />

      {/* Background Subtle Orbit Circle (Desktop - Lerp: 3.0px) */}
      <div 
        ref={orbitRef}
        style={{
          width: "550px",
          height: "550px",
          top: "40%",
          right: "5%",
          transform: "translateY(-50%)",
          animation: reducedMotion ? "none" : "spin 45s linear infinite",
        }}
        className="absolute border border-[#D7FF3F]/10 rounded-full opacity-[0.08] pointer-events-none z-0 hidden md:block transition-transform duration-300 ease-out animate-[spin_45s_linear_infinite]"
      />

      {/* Desktop Portrait Image (Absolute right column - w-[45%-52%], h-[70%-90%], object-center for perfect art direction) */}
      <motion.div 
        initial={reducedMotion ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 15, scale: 1.025 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.45 }}
        className="absolute right-[4%] xl:right-[5.5%] top-[8%] bottom-0 w-[36%] lg:w-[42%] xl:w-[48%] hidden md:block pointer-events-none z-10"
      >
        {/* Lerped translation container (Lerp: 8.0px) */}
        <div 
          ref={portraitRef}
          className="w-full h-full relative transition-transform duration-300 ease-out"
        >
          <img 
            src="/assets/Photo.png" 
            alt="Portrait of Kumaresh Jana, B.Tech CSE Student, Developer & Problem Solver" 
            fetchpriority="high"
            referrerPolicy="no-referrer"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse at 50% 48%, black 50%, transparent 92%)",
              maskImage: "radial-gradient(ellipse at 50% 48%, black 50%, transparent 92%)",
            }}
            className="w-full h-full object-cover object-center grayscale contrast-[1.08] brightness-[0.95]"
          />
          {/* Direct multi-edge smooth linear-gradients in #050505 to merge background void */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Left deep horizontal fade - dissolves aggressively to support name typography */}
            <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-gradient-to-r from-[#050505] via-[#050505]/30 to-transparent" />
            {/* Right horizontal fade - dissolves right boundary into black background */}
            <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-gradient-to-l from-[#050505] via-[#050505]/35 to-transparent" />
            {/* Bottom deep vertical fade - dissolves black shirt seamlessly */}
            <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            {/* Top vertical fade - transparent -> background above the head */}
            <div className="absolute top-0 left-0 right-0 h-[18%] bg-gradient-to-b from-[#050505] to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Main Content Container (pt-[100px] for mobile, pt-32 for desktop) */}
      <div className="max-w-[1360px] mx-auto w-full z-20 flex flex-col justify-between pt-[100px] md:pt-32 pb-12 min-h-[100svh]">
        {/* Technical Identity Metadata block - Reveal: 120ms (Centered on mobile, left-aligned on desktop) */}
        <motion.div 
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="flex flex-col gap-1 text-[10px] md:text-[11px] font-mono tracking-[0.20em] text-[#777777] uppercase select-none text-center md:text-left leading-relaxed"
        >
          <div>B.TECH CSE <span className="text-[#D7FF3F] mx-1.5">•</span> @ JIS UNIVERSITY</div>
          <div>KOLKATA, INDIA <span className="text-[#D7FF3F] mx-1.5">•</span> 2024 — 2028</div>
        </motion.div>
        
        {/* Editorial Text Block */}
        <div className="my-auto space-y-6 md:space-y-6 max-w-2xl lg:max-w-3xl flex flex-col pt-6 md:pt-0">
          {/* 1. Name Typography (Character stagger reveal, cubic-bezier ease, stable after entrance) */}
          <h1 
            ref={nameRef}
            style={{ lineHeight: "0.82" }}
            className="font-display font-black tracking-[-0.05em] select-none uppercase text-center md:text-left flex flex-col transition-transform duration-300 ease-out"
          >
            <span className="block overflow-hidden relative">
              {"KUMARESH".split("").map((char, index) => (
                <motion.span
                  key={index}
                  custom={index}
                  initial={reducedMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : { y: "100%", opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 + index * 0.035 }}
                  style={{ fontSize: "clamp(46px, 10.5vw, 96px)" }}
                  className="inline-block text-[#F4F2ED]"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="block overflow-hidden relative">
              {"JANA.".split("").map((char, index) => (
                <motion.span
                  key={index}
                  custom={index + 8}
                  initial={reducedMotion ? { opacity: 1, y: 0, filter: "blur(0px)" } : { y: "100%", opacity: 0, filter: "blur(10px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 + index * 0.035 }}
                  style={{ fontSize: "clamp(46px, 10.5vw, 96px)" }}
                  className="inline-block text-[#D7FF3F]"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>

          {/* 2. Mobile Portrait (Centered, inline watermark - styled with multi-edge gradients to erase boundaries) */}
          <div 
            style={{ width: "min(68vw, 220px)", overflow: "visible" }}
            className="mx-auto md:hidden pointer-events-none select-none my-3.5 relative aspect-[4/5] z-10"
          >
            <img 
              src="/assets/Photo.png" 
              alt="Portrait of Kumaresh Jana, B.Tech CSE Student and Developer at JIS University" 
              fetchpriority="high" 
              style={{
                WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 45%, transparent 88%)",
                maskImage: "radial-gradient(ellipse at 50% 45%, black 45%, transparent 88%)",
              }}
              className="w-full h-full object-cover grayscale contrast-[1.08] brightness-[0.95]"
            />
            {/* Direct multi-edge smooth linear-gradients in #050505 to merge background void */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {/* Bottom deep fade - dissolving shirt */}
              <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
              {/* Top fade - transparent -> background above the head */}
              <div className="absolute top-0 left-0 right-0 h-[16%] bg-gradient-to-b from-[#050505] to-transparent" />
              {/* Left fade */}
              <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-gradient-to-r from-[#050505] to-transparent" />
              {/* Right fade */}
              <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-gradient-to-l from-[#050505] to-transparent" />
            </div>
          </div>
          
          {/* 3. Sub-tagline - Reveal: 550ms (Centered on Mobile) */}
          <motion.div 
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.55 }}
            className="text-[10px] md:text-[11px] font-mono tracking-[0.12em] text-[#777777] uppercase select-none text-center md:text-left mt-5 lg:mt-6"
          >
            CSE STUDENT <span className="text-[#D7FF3F] mx-1">•</span> DEVELOPER <span className="text-[#D7FF3F] mx-1">•</span> PROBLEM SOLVER
          </motion.div>
          
          {/* 4. Short Bio description - Reveal: 650ms (17px size on mobile, centered) */}
          <motion.p 
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.65 }}
            className="max-w-[340px] md:max-w-[460px] text-[#777777] text-[17px] md:text-lg leading-relaxed font-light text-center md:text-left mx-auto md:mx-0 min-h-[5.5em] md:min-h-[4.5em]"
          >
            <TypingBio reducedMotion={reducedMotion} />
          </motion.p>
          
          {/* 5. Action CTAs - Reveal: 750ms (Tactile Micro-Interactions, Lift & Glow) */}
          <motion.div 
            initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.75 }}
            className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:gap-6 pt-2 w-full max-w-[340px] md:max-w-none mx-auto md:mx-0 z-20"
          >
            <motion.a 
              href="#projects" 
              data-cursor="cta"
              whileHover={{ scale: 1.02, y: -2, filter: "brightness(1.08)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="group w-full md:w-auto h-[46px] md:h-[42px] px-6 bg-[#D7FF3F] text-[#050505] font-display font-bold text-xs tracking-widest uppercase hover:shadow-[0_0_20px_rgba(215,255,63,0.30)] rounded-none flex items-center justify-center select-none cursor-pointer"
            >
              VIEW MY WORK <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200 ml-1">→</span>
            </motion.a>
            <motion.a 
              href="/Kumaresh_Jana_Resume.pdf" 
              download="Kumaresh_Jana_Resume.pdf"
              data-cursor="cta"
              whileHover={{ scale: 1.02, y: -2, boxShadow: "0 0 18px rgba(215,255,63,0.25)", backgroundColor: "rgba(215,255,63,0.08)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="group w-full md:w-auto h-[46px] md:h-[42px] px-6 border border-[#D7FF3F] text-[#F4F2ED] font-display font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-1.5 rounded-none select-none cursor-pointer"
            >
              DOWNLOAD RESUME <span className="inline-block transform group-hover:translate-y-0.5 transition-transform duration-200 ml-0.5">↓</span>
            </motion.a>
          </motion.div>
        </div>
        
        {/* Bottom Connect / Scroll Bars */}
        <motion.div 
          initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.85 }}
          className="flex flex-col md:flex-row justify-between items-center w-full pt-6 border-t border-white/[0.03] text-[10px] font-mono tracking-[0.2em] text-[#777777] gap-4 md:gap-0 mt-8 md:mt-0"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <span className="uppercase text-[#777777] select-none">LET'S CONNECT</span>
            <span className="text-white/[0.08] hidden md:inline">|</span>
            <div className="flex gap-4 justify-center">
              <a href="https://github.com/iamkumaresh" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Github size={15} /></a>
              <a href="https://www.linkedin.com/in/kumaresh-jana-050406k" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Linkedin size={15} /></a>
              <a href="https://www.instagram.com/_kumares_h" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Instagram size={15} /></a>
              <a href="https://www.facebook.com/share/18MBiWw7D3/" target="_blank" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Facebook size={15} /></a>
              <a href="mailto:kumaresh2106@gmail.com" className="text-[#777777] hover:text-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-150 inline-flex items-center justify-center p-1"><Mail size={15} /></a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 select-none text-[#777777]">
            <span>SCROLL</span>
            <span className="text-[#D7FF3F] animate-bounce">↓</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- SECTION REVEAL CONTAINER (Reduced Motion Compliant) ---
const SectionContainer = ({ children, className = "max-w-[1360px] mx-auto" }: { children: React.ReactNode; className?: string }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- ABOUT SECTION COMPONENT (Minimalist Editorial) ---
const About = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-[#050505] border-y border-white/[0.03] px-6 sm:px-12 md:px-16 lg:px-24 scroll-mt-28">
      <SectionContainer>
        
        {/* Core Large Editorial Statement */}
        <div className="max-w-4xl mb-24">
          <span className="text-meta text-[#777777] block mb-4">01 / WHO I AM</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold leading-[0.9] tracking-tighter text-balance text-[#F4F2ED]">
            I BUILD DIGITAL EXPERIENCES WITH <span className="text-[#D7FF3F] italic">CODE</span>, <span className="text-[#D7FF3F]">CURIOSITY</span> AND <span className="text-[#D7FF3F]">LOGIC.</span>
          </h2>
        </div>

        {/* Detailed Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-12 border-t border-white/[0.04]">
          
          {/* Biography Column */}
          <div className="lg:col-span-6 space-y-6 text-[#777777] text-lg md:text-xl font-light leading-relaxed">
            <p>
              I am a proactive learner with a focused specialization in Advanced Data Structures and Algorithms. My passion lies in building scalable, high-impact software solutions and engineering fluid frontend layouts.
            </p>
            <p>
              Beyond coding, I value technical communication, analytical problem-solving, and team collaboration. I believe that the best solutions arise from structured, clean logic and a constant focus on user experience.
            </p>
          </div>

          {/* Soft Skills Column */}
          <div className="lg:col-span-3 lg:col-start-8 space-y-6">
            <h3 className="text-meta text-[#F4F2ED] border-b border-white/[0.08] pb-2">SOFT SKILLS</h3>
            <ul className="space-y-3 text-[#777777] text-sm font-mono">
              <li className="flex items-center gap-2"><span className="text-[#D7FF3F]">/</span> Technical Communication</li>
              <li className="flex items-center gap-2"><span className="text-[#D7FF3F]">/</span> Team Collaboration</li>
              <li className="flex items-center gap-2"><span className="text-[#D7FF3F]">/</span> Problem Solving</li>
              <li className="flex items-center gap-2"><span className="text-[#D7FF3F]">/</span> Proactive Learning</li>
            </ul>
          </div>

          {/* Languages Column */}
          <div className="lg:col-span-2 lg:col-start-11 space-y-6">
            <h3 className="text-meta text-[#F4F2ED] border-b border-white/[0.08] pb-2">LANGUAGES</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-mono text-[10px] text-[#777777] block">BENGALI</span>
                <span className="text-[#F4F2ED] font-semibold text-sm">Native</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#777777] block">ENGLISH</span>
                <span className="text-[#F4F2ED] font-semibold text-sm">Intermediate</span>
              </div>
              <div>
                <span className="font-mono text-[10px] text-[#777777] block">HINDI</span>
                <span className="text-[#F4F2ED] font-semibold text-sm">Intermediate</span>
              </div>
            </div>
          </div>

        </div>
      </SectionContainer>
    </section>
  );
};

// --- EDUCATION SECTION COMPONENT ---
const Education = () => {
  const education = [
    {
      year: "EXPECTED 2028",
      title: "B.Tech: Computer Science & Engineering",
      institution: "JIS UNIVERSITY — Kolkata",
      details: "9+ SGPA Grade"
    },
    {
      year: "2024",
      title: "Higher Secondary: Science",
      institution: "Daharkundu Sree Ramkrishna HS",
      details: "80% Marks"
    },
    {
      year: "2022",
      title: "Madhyamik",
      institution: "Daharkundu Sree Ramkrishna HS",
      details: "78% Marks"
    },
    {
      year: "2018",
      title: "Primary Education",
      institution: "Daharkundu Surya Bag Vidyamandir",
      details: "A+ Grade"
    }
  ];

  return (
    <section id="education" className="py-24 md:py-32 bg-[#050505] px-6 sm:px-12 md:px-16 lg:px-24 scroll-mt-28">
      <SectionContainer>
        <div className="mb-24">
          <span className="text-meta text-[#777777] block mb-4">02 / MY ACADEMIC ROAD</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold leading-[0.9] tracking-tighter text-[#F4F2ED]">EDUCATION.</h2>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-0 relative pt-8 md:pt-16 border-l md:border-l-0 md:border-t border-white/[0.08] pl-6 md:pl-0 md:divide-x md:divide-white/[0.04]">
          
          {/* Vertical marker bar on Mobile */}
          <div className="absolute top-0 left-0 w-[1px] h-full bg-white/[0.08] md:hidden" />

          {education.map((edu, idx) => (
            <div 
              key={idx}
              className="relative group md:px-8 first:pl-0 last:pr-0"
            >
              {/* Timeline Bullet Point */}
              <div className="absolute md:-top-[21px] -left-[31px] md:-left-[5px] w-2.5 h-2.5 rounded-full bg-[#050505] border-2 border-[#D7FF3F] group-hover:scale-150 transition-transform duration-300 z-10" />
              
              <div className="space-y-4">
                <span className="text-meta text-[#D7FF3F] text-[10px]">{edu.year}</span>
                <h3 className="text-lg md:text-xl font-display font-bold text-[#F4F2ED] leading-snug">{edu.title}</h3>
                <p className="text-sm text-[#777777] font-light">{edu.institution}</p>
                <div className="inline-block text-[10px] font-mono text-[#D7FF3F] bg-[#D7FF3F]/5 border border-[#D7FF3F]/10 rounded px-2.5 py-1 uppercase tracking-wider">
                  {edu.details}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
};

// --- SKILLS COMPONENT (Interactive Directory Rows) ---
const Skills = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  const skillCategories = [
    {
      title: "LANGUAGES",
      desc: "Coding languages used for software development, data structures, and scripting.",
      list: ["Java (DSA)", "C Language", "Basic C++", "Basic Python", "JavaScript (ES6+)"]
    },
    {
      title: "TECHNICAL & CORE",
      desc: "Low-level system architecture, databases, and structural algorithms.",
      list: ["Advanced Data Structures", "Algorithms Design", "Computer Architecture", "Operating Systems"]
    },
    {
      title: "FRONTEND ENGINE",
      desc: "Frameworks, design systems, and responsive rendering engines.",
      list: ["HTML5", "CSS3 / Vanilla CSS", "Bootstrap"]
    },
    {
      title: "SOFT SKILLS",
      desc: "Interpersonal communication and collaborative professional methods.",
      list: ["Technical Writing", "Team Collaboration", "Logical Problem Solving", "Proactive Learning"]
    }
  ];

  return (
    <section id="skills" className="py-24 md:py-32 bg-[#050505] px-6 sm:px-12 md:px-16 lg:px-24 scroll-mt-28">
      <SectionContainer>
        <div className="mb-24">
          <span className="text-meta text-[#777777] block mb-4">03 / TECHNICAL CAPABILITIES</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold leading-[0.9] tracking-tighter text-[#F4F2ED]">SKILL SETS.</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-8 border-t border-white/[0.08]">
          
          {/* Left: Category Titles Directory */}
          <div className="lg:col-span-6 flex flex-col w-full divide-y divide-white/[0.03]">
            {skillCategories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(idx)}
                onMouseEnter={() => setActiveCategory(idx)}
                className={`text-left py-6 flex items-center justify-between transition-all duration-300 font-display text-2xl font-bold
                  ${activeCategory === idx 
                    ? "text-[#D7FF3F] translate-x-2" 
                    : "text-[#777777] hover:text-[#F4F2ED]"
                  }`}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-[#777777] opacity-60">0{idx + 1} //</span>
                  {cat.title}
                </span>
                {activeCategory === idx && <span className="w-2 h-2 rounded-full bg-[#D7FF3F] shadow-[0_0_8px_#D7FF3F]" />}
              </button>
            ))}
          </div>

          {/* Right: Detailed Skills Display */}
          <div className="lg:col-span-6 bg-white/[0.01] border border-white/[0.03] rounded-2xl p-8 md:p-10 min-h-[340px] flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-meta text-[#D7FF3F] text-[10px] font-semibold">// CATEGORY OVERVIEW</span>
              <h3 className="text-3xl font-display font-black text-[#F4F2ED]">{skillCategories[activeCategory].title}</h3>
              <p className="text-[#777777] leading-relaxed font-light text-sm md:text-base">{skillCategories[activeCategory].desc}</p>
            </div>
            
            <div className="pt-8 border-t border-white/[0.03] mt-8">
              <span className="text-meta text-[#777777] text-[10px] block mb-4">// SKILL ELEMENTS</span>
              <div className="flex flex-wrap gap-2">
                {skillCategories[activeCategory].list.map((skill, sIdx) => (
                  <span 
                    key={sIdx}
                    className="font-mono text-[11px] text-[#F4F2ED] bg-[#050505] border border-white/[0.06] rounded-md px-4 py-2 hover:border-[#D7FF3F] hover:text-[#D7FF3F] transition-all duration-300 select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </SectionContainer>
    </section>
  );
};

// --- SELECTED PROJECTS SECTION COMPONENT (Clean Organized Showcase Grid) ---
const Projects = () => {
  const [showAllProjects, setShowAllProjects] = useState(false);

  const projects = [
    {
      num: "01",
      title: "SIGNFLUX",
      subtitle: "Gesture to Speech Model",
      category: "Development / AI",
      image: "/assets/SF.png",
      demoLink: "https://gesture-to-speech.vercel.app/",
      tech: ["HTML", "CSS", "TypeScript", "React", "Tailwind"]
    },
    {
      num: "02",
      title: "CANTEEN SYSTEM",
      subtitle: "Management Platform",
      category: "Web Development",
      image: "/assets/CMS1.png",
      demoLink: "https://iamkumaresh.github.io/Canteen-Management-System/",
      tech: ["HTML5", "CSS3", "JavaScript", "Local Storage"]
    },
    {
      num: "03",
      title: "SIMON GAME",
      subtitle: "Pattern Memory Match",
      category: "JavaScript / Game",
      image: "/assets/SG.png",
      demoLink: "https://iamkumaresh.github.io/Simon-Game/",
      tech: ["CSS Animations", "HTML","Vanilla JavaScript"]
    },
    {
      num: "04",
      title: "SPOTIFY CLONE",
      subtitle: "Responsive Audio UI",
      category: "Frontend Design",
      image: "/assets/SC.png",
      demoLink: "https://iamkumaresh.github.io/Spotify-Clone/",
      tech: ["HTML5", "CSS Grid/Flexbox", "JS", "Responsive Design"]
    },
    {
      num: "05",
      title: "Notes Nexus",
      subtitle: "JIS University Study Hub — Notes, PYQs & Student Marketplace",
      category: "EdTech / Student Productivity Platform",
      image: "/assets/NN.png",
      demoLink: "https://notes-nexus-jisu.vercel.app/",
      tech: ["Next.js 16 (App Router, React 19)", "TypeScript + JavaScript", "Tailwind CSS 4", "Cloudinary", "Supabase", "Responsive Design"]
    },
    {
      num: "06",
      title: "CMS APP",
      subtitle: "Android application for canteen management",
      category: "Full Stack Development",
      image: "/assets/cmsApp.png",
      demoLink: "https://drive.google.com/file/d/1QdghMGLwO111pFRUorSVkRL1m7vX3lj6/view?usp=drive_link",
      tech: ["JAVA", "Android"]
    }
  ];

  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const projectsTrackRef = useRef<HTMLDivElement>(null);

  const handleProjectsScroll = () => {
    if (!projectsTrackRef.current) return;
    const container = projectsTrackRef.current;
    const scrollLeft = container.scrollLeft;
    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const cardWidth = firstChild.offsetWidth;
    const gap = 20; // gap-5 (20px)
    const index = Math.round(scrollLeft / (cardWidth + gap));
    const clamped = Math.max(0, Math.min(projects.length - 1, index));
    if (clamped !== activeProjectIndex) {
      setActiveProjectIndex(clamped);
    }
  };

  const scrollToProject = (index: number) => {
    if (!projectsTrackRef.current) return;
    const container = projectsTrackRef.current;
    const card = container.children[index] as HTMLElement | null;
    if (card) {
      const cardLeft = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, cardLeft),
        behavior: "smooth"
      });
      setActiveProjectIndex(index);
    }
  };

  const renderProjectCard = (project: typeof projects[0], idx: number) => (
    <div
      key={idx}
      onClick={() => window.open(project.demoLink, "_blank", "noopener,noreferrer")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          window.open(project.demoLink, "_blank", "noopener,noreferrer");
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View demo for project: ${project.title} — ${project.subtitle}`}
      className={`group cursor-pointer flex flex-col bg-white/[0.01] border border-white/[0.05] rounded-[10px] p-4 transition-all duration-300 hover:-translate-y-[4px] hover:border-[#D7FF3F]/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-1 focus:ring-[#D7FF3F] ${
        showAllProjects
          ? "w-full md:w-auto"
          : "w-[85vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-align-none"
      }`}
    >
      {/* Image Preview (Consistent 16/10 aspect ratio, 55-65% card height flow) */}
      <div className="aspect-[16/10] w-full overflow-hidden rounded-[6px] relative bg-[#0D0D0D]" data-cursor="project">
        <img 
          src={project.image} 
          alt={`Preview screenshot of ${project.title} — ${project.subtitle}`}
          className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/* Visual Bottom Accent Indicator */}
        <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D7FF3F] group-hover:w-full transition-all duration-300" />
      </div>

      {/* Card Meta Content */}
      <div className="pt-4 flex-grow flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#777777]">
            <span>{project.num}</span>
            <span className="uppercase tracking-wider">{project.category}</span>
          </div>
          <h3 className="text-lg font-display font-extrabold text-[#F4F2ED] group-hover:text-[#D7FF3F] transition-colors uppercase tracking-tight">
            {project.title}
          </h3>
          <p className="text-[#777777] font-light text-xs line-clamp-2 leading-relaxed">
            {project.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {/* Technology Tags (Separators use visual lime accents) */}
          <div className="flex flex-wrap items-center gap-1 text-[9px] font-mono text-[#777777] uppercase tracking-wider">
            {project.tech.map((t, tIdx) => (
              <React.Fragment key={tIdx}>
                {tIdx > 0 && <span className="text-[#D7FF3F] mx-1">•</span>}
                <span>{t}</span>
              </React.Fragment>
            ))}
          </div>

          <a 
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-[#D7FF3F] font-bold inline-flex items-center gap-1.5 hover:brightness-110 active:scale-[0.97] transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            VIEW PROJECT <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section id="projects" className="py-24 md:py-32 bg-[#050505] px-6 sm:px-12 md:px-16 lg:px-24 scroll-mt-28">
      <SectionContainer>
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 md:mb-16 gap-6">
          <div>
            <span className="text-meta text-[#777777] block mb-4">04 / SELECTED WORK</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold leading-[0.9] tracking-tighter text-[#F4F2ED]">PROJECTS.</h2>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <a 
              href="https://github.com/iamkumaresh" 
              target="_blank"
              data-cursor="external"
              className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#F4F2ED] hover:text-[#D7FF3F] hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 pb-1 border-b border-white/[0.08] hover:border-[#D7FF3F]"
            >
              GITHUB PROFILE <ExternalLink size={14} />
            </a>
            <button
              type="button"
              onClick={() => setShowAllProjects((prev) => !prev)}
              aria-expanded={showAllProjects}
              aria-controls="projects-track"
              className="md:hidden px-3.5 py-1.5 bg-[#D7FF3F] text-[#050505] font-display font-bold text-[10px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer select-none hover:shadow-[0_0_15px_rgba(215,255,63,0.30)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
            >
              {showAllProjects ? "Show Less" : "View All"} <span className="text-[12px] inline-block transition-transform duration-200">{showAllProjects ? "↑" : "↓"}</span>
            </button>
          </div>
        </div>

        {/* Responsive Showcase: Mobile Swipeable Carousel or Expanded Grid, Desktop Responsive Grid */}
        <div 
          id="projects-track"
          ref={projectsTrackRef}
          onScroll={handleProjectsScroll}
          className={`pt-4 md:pt-0 ${
            showAllProjects
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
              : "carousel-track flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible"
          }`}
        >
          {projects.map((project, idx) => renderProjectCard(project, idx))}
        </div>

        {/* Animated Dot Indicators on Mobile (Hidden when View All is toggled) */}
        {!showAllProjects && projects.length > 1 && (
          <div 
            className="flex md:hidden items-center justify-center gap-2 mt-4 select-none"
            role="tablist"
            aria-label="Projects slide pagination"
          >
            {projects.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={activeProjectIndex === i}
                aria-label={`Go to project slide ${i + 1}`}
                onClick={() => scrollToProject(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ease-out cursor-pointer ${
                  activeProjectIndex === i
                    ? "w-5 bg-[#D7FF3F]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </SectionContainer>
    </section>
  );
};

// --- CERTIFICATIONS SECTION COMPONENT (Credential Card Grid) ---
const Certifications = ({ onOpenLightbox }: { onOpenLightbox: (cert: Certificate) => void }) => {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  const certsTrackRef = useRef<HTMLDivElement>(null);

  const handleCertsScroll = () => {
    if (!certsTrackRef.current) return;
    const container = certsTrackRef.current;
    const scrollLeft = container.scrollLeft;
    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    const cardWidth = firstChild.offsetWidth;
    const gap = 20; // gap-5 (20px)
    const index = Math.round(scrollLeft / (cardWidth + gap));
    const clamped = Math.max(0, Math.min(certificatesData.length - 1, index));
    if (clamped !== activeCertIndex) {
      setActiveCertIndex(clamped);
    }
  };

  const scrollToCert = (index: number) => {
    if (!certsTrackRef.current) return;
    const container = certsTrackRef.current;
    const card = container.children[index] as HTMLElement | null;
    if (card) {
      const cardLeft = card.offsetLeft - container.offsetLeft - (container.clientWidth - card.offsetWidth) / 2;
      container.scrollTo({
        left: Math.max(0, cardLeft),
        behavior: "smooth"
      });
      setActiveCertIndex(index);
    }
  };

  const renderCertCard = (cert: Certificate, idx: number) => (
    <div 
      key={cert.id} 
      onClick={() => onOpenLightbox(cert)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenLightbox(cert);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View certificate details for ${cert.title} issued by ${cert.issuer}`}
      className={`group cursor-pointer flex flex-col bg-white/[0.025] border border-white/[0.10] rounded-[10px] p-4 transition-all duration-300 hover:-translate-y-[4px] hover:border-[#D7FF3F]/30 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5)] focus:outline-none focus:ring-1 focus:ring-[#D7FF3F] ${
        showAllCerts
          ? "w-full md:w-auto"
          : "w-[85vw] max-w-[340px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink md:snap-align-none"
      }`}
    >
      {/* Certificate Preview container - preserves ratios without distortion */}
      <div className="aspect-[16/10] w-full overflow-hidden bg-black/40 border border-white/[0.05] rounded-[6px] relative flex items-center justify-center">
        <img 
          src={cert.image} 
          alt={`Credential certificate for ${cert.title} issued by ${cert.issuer}`}
          className="w-full h-full object-contain p-2 group-hover:scale-[1.02] transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[#050505]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-[10px] font-mono text-[#D7FF3F] bg-[#050505] px-3 py-1.5 border border-[#D7FF3F]">VIEW CREDENTIAL</span>
        </div>
      </div>
      
      {/* Certificate Details */}
      <div className="pt-4 flex-grow flex flex-col justify-between gap-4">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-mono text-[#777777]">
            <span>{cert.issuer}</span>
            <span>{cert.date}</span>
          </div>
          <h3 className="text-base font-display font-bold text-[#F4F2ED] group-hover:text-[#D7FF3F] transition-colors leading-tight line-clamp-1 pt-1">
            {cert.title}
          </h3>
        </div>

        <a 
          href={cert.certificateUrl || cert.image}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-mono text-[#D7FF3F] font-bold inline-flex items-center gap-1.5 hover:brightness-110 active:scale-[0.97] transition-all duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          VIEW CERTIFICATE <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">→</span>
        </a>
      </div>
    </div>
  );

  return (
    <section id="certifications" className="py-24 md:py-32 bg-[#050505] px-6 sm:px-12 md:px-16 lg:px-24 scroll-mt-28">
      <SectionContainer>
        
        {/* Section Header */}
        <div className="flex justify-between items-end mb-16 gap-6">
          <div>
            <span className="text-meta text-[#777777] block mb-4">05 / CREDENTIAL ARCHIVE</span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold leading-[0.9] tracking-tighter text-[#F4F2ED]">CERTIFICATIONS.</h2>
          </div>
          <button
            type="button"
            onClick={() => setShowAllCerts((prev) => !prev)}
            aria-expanded={showAllCerts}
            aria-controls="certs-track"
            className="md:hidden px-3.5 py-1.5 bg-[#D7FF3F] text-[#050505] font-display font-bold text-[10px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer select-none hover:shadow-[0_0_15px_rgba(215,255,63,0.30)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200"
          >
            {showAllCerts ? "Show Less" : "View All"} <span className="text-[12px] inline-block transition-transform duration-200">{showAllCerts ? "↑" : "↓"}</span>
          </button>
        </div>

        {certificatesData.length === 0 ? (
          <div className="py-20 border-t border-white/[0.04] text-center select-none">
            <p className="font-mono text-sm text-[#777777] uppercase tracking-widest">
              Certificates and credentials will appear here.
            </p>
          </div>
        ) : (
          <>
            {/* Responsive Showcase: Mobile Swipeable Carousel or Expanded Grid, Desktop Responsive Grid */}
            <div 
              id="certs-track"
              ref={certsTrackRef}
              onScroll={handleCertsScroll}
              className={`pt-8 border-t border-white/[0.08] ${
                showAllCerts
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                  : "carousel-track flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-5 pb-4 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8 md:overflow-visible"
              }`}
            >
              {certificatesData.map((cert, idx) => renderCertCard(cert, idx))}
            </div>

            {/* Animated Dot Indicators on Mobile (Hidden when View All is toggled) */}
            {!showAllCerts && certificatesData.length > 1 && (
              <div 
                className="flex md:hidden items-center justify-center gap-2 mt-4 select-none"
                role="tablist"
                aria-label="Certifications slide pagination"
              >
                {certificatesData.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={activeCertIndex === i}
                    aria-label={`Go to certificate slide ${i + 1}`}
                    onClick={() => scrollToCert(i)}
                    className={`h-1.5 rounded-full transition-all duration-200 ease-out cursor-pointer ${
                      activeCertIndex === i
                        ? "w-5 bg-[#D7FF3F]"
                        : "w-1.5 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </SectionContainer>
    </section>
  );
};

// --- CERTIFICATE MODAL LIGHTBOX WITH KEYBOARD ACCESSIBILITY AND FOCUS TRAP ---
const LightboxModal = ({ cert, onClose }: { cert: Certificate; onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!modalRef.current) return;
    
    // Grab all tab-focusable nodes inside the modal container
    const focusableElements = modalRef.current.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex="0"]'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    window.addEventListener('keydown', handleTabTrap);
    
    // Auto-focus first control item on mount
    firstElement?.focus();
    
    return () => window.removeEventListener('keydown', handleTabTrap);
  }, []);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#050505]/95 backdrop-blur-md flex items-center justify-center p-6"
    >
      <div 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full flex flex-col items-center gap-6"
      >
        <div className="relative w-full aspect-[4/3] max-h-[70vh] bg-white/[0.01] border border-white/[0.06] flex items-center justify-center overflow-hidden">
          <img 
            src={cert.image} 
            alt={`Full credential document preview for ${cert.title} issued by ${cert.issuer}`} 
            className="w-full h-full object-contain p-4"
          />
        </div>

        <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs font-mono text-[#777777] border-t border-white/[0.06] pt-4">
          <div className="space-y-1">
            <h4 className="text-sm font-display font-bold text-[#F4F2ED]">{cert.title}</h4>
            <p>{cert.issuer} • {cert.date} {cert.credentialId && `• ID: ${cert.credentialId}`}</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {cert.verificationUrl && (
              <a 
                href={cert.verificationUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-[#D7FF3F] hover:underline"
              >
                VERIFY CREDENTIAL →
              </a>
            )}
            <a 
              href={cert.certificateUrl || cert.image} 
              download 
              className="text-[#F4F2ED] hover:underline"
            >
              DOWNLOAD
            </a>
            <button 
              onClick={onClose}
              className="text-white hover:text-[#D7FF3F] font-bold px-2 py-1"
            >
              CLOSE (ESC)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CONTACT SECTION COMPONENT ---
const ContactForm = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setStatus("sending");

    try {
      const formData = new FormData(formRef.current);
      const response = await fetch("https://formspree.io/f/xdawlndl", { 
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setStatus("success");
        formRef.current.reset();
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="bg-transparent w-full">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-1 text-left">
            <label htmlFor="name" className="text-[10px] font-mono text-[#777777] tracking-[0.2em] uppercase block">Full Name</label>
            <input
              required
              type="text"
              id="name"
              name="name"
              placeholder="e.g. Kumaresh Jana"
              className="w-full bg-transparent border-b border-white/[0.20] py-3 outline-none focus:border-[#D7FF3F] text-[#F4F2ED] font-sans text-base transition-all placeholder:text-white/[0.24] rounded-none"
            />
          </div>
          <div className="space-y-1 text-left">
            <label htmlFor="email" className="text-[10px] font-mono text-[#777777] tracking-[0.2em] uppercase block">Email Address</label>
            <input
              required
              type="email"
              id="email"
              name="email"
              placeholder="e.g. kumaresh@example.com"
              className="w-full bg-transparent border-b border-white/[0.20] py-3 outline-none focus:border-[#D7FF3F] text-[#F4F2ED] font-sans text-base transition-all placeholder:text-white/[0.24] rounded-none"
            />
          </div>
        </div>

        <div className="space-y-1 text-left">
          <label htmlFor="subject" className="text-[10px] font-mono text-[#777777] tracking-[0.2em] uppercase block">Subject</label>
          <input
            required
            type="text"
            id="subject"
            name="subject"
            placeholder="e.g. Project Inquiry"
            className="w-full bg-transparent border-b border-white/[0.20] py-3 outline-none focus:border-[#D7FF3F] text-[#F4F2ED] font-sans text-base transition-all placeholder:text-white/[0.24] rounded-none"
          />
        </div>

        <div className="space-y-1 text-left">
          <label htmlFor="message" className="text-[10px] font-mono text-[#777777] tracking-[0.2em] uppercase block">Message</label>
          <textarea
            required
            id="message"
            name="message"
            rows={4}
            placeholder="Introduce your project details..."
            className="w-full bg-transparent border-b border-white/[0.20] py-3 outline-none focus:border-[#D7FF3F] text-[#F4F2ED] font-sans text-base transition-all placeholder:text-white/[0.24] resize-none rounded-none"
          />
        </div>

        <button
          data-cursor="cta"
          disabled={status === "sending" || status === "success"}
          type="submit"
          className="w-full bg-[#D7FF3F] text-[#050505] py-4 rounded-none font-display font-bold text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-[#F4F2ED] hover:text-[#050505] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 disabled:opacity-75 disabled:hover:scale-100 disabled:hover:bg-[#D7FF3F] cursor-pointer select-none"
        >
          {status === "idle" && (
            <>
              SEND MESSAGE <Send size={14} />
            </>
          )}
          {status === "sending" && (
            <>
              SENDING MESSAGE... <Loader2 size={14} className="animate-spin" />
            </>
          )}
          {status === "success" && (
            <>
              MESSAGE DELIVERED! <CheckCircle size={14} />
            </>
          )}
          {status === "error" && "TRY AGAIN"}
        </button>
        
        {status === "success" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-xs font-mono text-[#D7FF3F]"
          >
            Thank you! I will get back to you shortly.
          </motion.p>
        )}
      </form>
    </div>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-[#050505] px-6 sm:px-12 md:px-16 lg:px-24 scroll-mt-28">
      <SectionContainer>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column (Editorial Heading & Links) */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <span className="text-meta text-[#777777] block mb-4">06 / LET'S CONNECT</span>
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-extrabold leading-[1.0] tracking-tighter text-[#F4F2ED]">
                LET'S BUILD<br />
                SOMETHING<br />
                <span className="text-[#D7FF3F] italic">EXTRAORDINARY.</span>
              </h2>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/[0.04]">
              <div>
                <span className="text-[10px] font-mono text-[#777777] uppercase block">LOCATION</span>
                <span className="text-lg text-[#F4F2ED]">Arambagh, Hooghly, India</span>
              </div>
              
              <div>
                <span className="text-[10px] font-mono text-[#777777] uppercase block">CALL</span>
                <a href="tel:+918159****71" className="text-lg text-[#F4F2ED] hover:text-[#D7FF3F] hover:translate-x-1 transition-all duration-200 inline-block">+91 8159****71</a>
              </div>

              <div>
                <span className="text-[10px] font-mono text-[#777777] uppercase block">EMAIL</span>
                <a href="mailto:kumaresh2106@gmail.com" className="text-lg text-[#F4F2ED] hover:text-[#D7FF3F] transition-all duration-200 border-b border-white/[0.08] hover:border-[#D7FF3F] pb-0.5 inline-block">
                  kumaresh2106@gmail.com  
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-meta text-[10px] text-[#777777]">
              <a href="https://github.com/iamkumaresh" target="_blank" className="hover:text-[#D7FF3F] hover:scale-105 active:scale-95 transition-all duration-150 inline-flex items-center gap-1.5"><Github size={14} /> GITHUB</a>
              <a href="https://www.linkedin.com/in/kumaresh-jana-050406k" target="_blank" className="hover:text-[#D7FF3F] hover:scale-105 active:scale-95 transition-all duration-150 inline-flex items-center gap-1.5"><Linkedin size={14} /> LINKEDIN</a>
              <a href="https://www.instagram.com/_kumares_h" target="_blank" className="hover:text-[#D7FF3F] hover:scale-105 active:scale-95 transition-all duration-150 inline-flex items-center gap-1.5"><Instagram size={14} /> INSTAGRAM</a>
              <a href="https://www.facebook.com/share/18MBiWw7D3/" target="_blank" className="hover:text-[#D7FF3F] hover:scale-105 active:scale-95 transition-all duration-150 inline-flex items-center gap-1.5"><Facebook size={14} /> FACEBOOK</a>
            </div>
          </div>

          {/* Right Column (Message Form) */}
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>

        </div>
      </SectionContainer>
    </section>
  );
};

// --- FOOTER COMPONENT ---
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 bg-[#050505] text-[#777777] text-xs border-t border-white/[0.03] px-6 sm:px-12 md:px-16 lg:px-24">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-display font-black text-lg text-[#F4F2ED] tracking-tighter">KJ<span className="text-[#D7FF3F]">.</span></span>
          <p>© 2026 Kumaresh Jana. Built with passion.</p>
        </div>
        <div className="flex items-center gap-8">
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#777777] flex items-center gap-2"><Phone size={12} /> +91 8159****71</p>
          <button
            onClick={scrollToTop}
            className="p-3 bg-[#0D0D0D] border border-white/[0.04] rounded-md text-[#777777] hover:text-[#050505] hover:bg-[#D7FF3F] hover:border-[#D7FF3F] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
            aria-label="Back to top"
          >
            <ChevronUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

// --- MAIN PORTFOLIO ROOT COMPONENT ---
export default function Portfolio() {
  const [lightboxCert, setLightboxCert] = useState<Certificate | null>(null);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-[#050505] text-[#F4F2ED] selection:bg-[#D7FF3F] selection:text-[#050505] relative">
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Education />
          <Skills />
          <Projects />
          <Certifications onOpenLightbox={setLightboxCert} />
          <Contact />
        </main>
        <Footer />

        {/* LightboxModal Modal for certificate inspection */}
        {lightboxCert && (
          <LightboxModal 
            cert={lightboxCert} 
            onClose={() => setLightboxCert(null)} 
          />
        )}
      </div>
    </MotionConfig>
  );
}
