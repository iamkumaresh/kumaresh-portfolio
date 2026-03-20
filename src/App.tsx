import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink, Code2, Palette, Terminal, User, Facebook, Instagram, Phone, Download, Sun, Moon, Menu, X, ChevronUp, Send, CheckCircle, Loader2 } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

const Navbar = ({ theme, toggleTheme }: { theme: string, toggleTheme: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4 glass shadow-sm" : "py-6 bg-transparent"}`}>
      <div className="section-container flex justify-between items-center">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 shadow-sm"
          >
            <img 
              src="/Photo.jpg" 
              alt="Kumaresh Jana" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter font-sans"
          >
            K J
          </motion.div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                whileHover={{ y: -2 }}
                className="hover:text-neutral-700 dark:hover:text-neutral-400 transition-colors"
              >
                {link.name}
              </motion.a>
            ))}
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-900 dark:text-neutral-50"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium hover:text-neutral-700 dark:hover:text-neutral-400"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden">
      <div className="section-container pt-28 pb-20 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-neutral-800 dark:text-neutral-400 mb-6 block"
          >
            CSE Student @ JIS University
          </motion.span>
          <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-serif font-bold leading-[0.85] tracking-tighter mb-10 text-balance">
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block"
            >
              Kumaresh
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="italic text-neutral-800 dark:text-neutral-400 block"
            >
              Jana
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-xl text-lg md:text-xl text-neutral-900 dark:text-neutral-400 leading-relaxed mb-12 text-balance font-light"
          >
            Dedicated 2nd-year Computer Science Engineering student with a strong foundation in Java, DSA, and low-level programming. Building responsive user interfaces and scalable software solutions.
          </motion.p>
          <div className="flex flex-wrap gap-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 py-3 md:py-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-900 rounded-full font-medium shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
            >
              View Work
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 py-3 md:py-4 border border-neutral-200 dark:border-neutral-800 rounded-full font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all flex items-center gap-2 text-sm md:text-base"
            >
              <Download size={18} /> CV
            </motion.a>
            <motion.a
              href="/Kumaresh_Jana_Resume.pdf"
              download="Kumaresh_Jana_Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 py-3 md:py-4 border border-neutral-200 dark:border-neutral-800 rounded-full font-medium hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all flex items-center gap-2 text-sm md:text-base"
            >
              <Download size={18} /> Resume
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative lg:ml-auto"
        >
          <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-neutral-800 group">
             <img 
               src="/Photo.jpg" 
               alt="Kumaresh Jana" 
               className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500" />
          </div>
          
          {/* Floating decorative badge */}
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute -bottom-8 -left-8 glass p-6 rounded-3xl shadow-2xl border border-white/40 dark:border-neutral-700/50 z-20"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-900 dark:bg-neutral-50 flex items-center justify-center text-white dark:text-neutral-900 shadow-lg">
                <Terminal size={24} />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-800 dark:text-neutral-400">Specialization</p>
                <p className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-400">Java & DSA</p>
              </div>
            </div>
          </motion.div>

          {/* Background glow */}
          <div className="absolute -inset-4 bg-neutral-200 dark:bg-neutral-800 rounded-[4rem] blur-2xl -z-10 opacity-30 animate-pulse" />
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-20 -right-20 w-64 md:w-96 h-64 md:h-96 bg-neutral-100 dark:bg-neutral-900 rounded-full blur-3xl -z-10 opacity-50" />
      <div className="absolute top-40 -left-20 w-48 md:w-72 h-48 md:h-72 bg-neutral-100 dark:bg-neutral-900 rounded-full blur-3xl -z-10 opacity-50" />
    </section>
  );
};

const About = () => {
  const skills = [
    { icon: <Code2 size={20} />, title: "Languages", desc: "Java (DSA), C, Basic C++, Basic Python, JavaScript" },
    { icon: <Terminal size={20} />, title: "Technical", desc: "Advanced DSA, Computer Architecture & Operating System" },
    { icon: <Palette size={20} />, title: "Frontend", desc: "HTML, CSS, Responsive UI Design" },
  ];

  const education = [
    {
      year: "Expected 2028",
      title: "B.Tech: Computer Science & Engineering",
      institution: "JIS UNIVERSITY - Agarpara, Kolkata",
      details: "9+ SGPA"
    },
    {
      year: "2024",
      title: "Higher Secondary: Science",
      institution: "Daharkundu Sree Ramkrishna High School",
      details: "80% Marks"
    },
    {
      year: "2022",
      title: "Madhyamik",
      institution: "Daharkundu Sree Ramkrishna High School",
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
    <section id="about" className="py-24 md:py-32 bg-white dark:bg-neutral-900/30 border-y border-neutral-100 dark:border-neutral-800">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-7xl font-sans font-black mb-10 leading-[0.9] tracking-tighter"
            >
              Building the future <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-white dark:via-neutral-400 dark:to-white">
                with code and logic.
              </span>
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-neutral-900 dark:text-neutral-400 leading-relaxed text-lg mb-12 font-light"
            >
              <p>
                I am a proactive learner with a focused specialization in Advanced Data Structures and Algorithms. My passion lies in building scalable, high-impact software solutions.
              </p>
              <p>
                Beyond coding, I value technical communication and team collaboration, believing that the best solutions come from shared knowledge and mentorship.
              </p>
            </motion.div>

            <div className="space-y-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-800 dark:text-neutral-400">Education</h3>
              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="border-l border-neutral-100 dark:border-neutral-800 pl-6 relative"
                  >
                    <div className="absolute w-2 h-2 bg-neutral-900 dark:bg-neutral-50 rounded-full -left-[4.5px] top-2" />
                    <span className="text-sm font-mono text-neutral-800 dark:text-neutral-400">{edu.year}</span>
                    <h4 className="text-lg font-bold mt-1">{edu.title}</h4>
                    <p className="text-neutral-900 dark:text-neutral-400">{edu.institution}</p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-400 mt-1">{edu.details}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-800 dark:text-neutral-400 mb-2">Core Skills</h3>
            <div className="grid gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card-base group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-neutral-900 dark:group-hover:bg-neutral-50 group-hover:text-white dark:group-hover:text-neutral-900 transition-colors">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
                  <p className="text-neutral-900 dark:text-neutral-400">{skill.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="card-base bg-neutral-50 dark:bg-neutral-900/50">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <User size={18} /> Soft Skills
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-900 dark:text-neutral-400">
                <li className="flex items-center gap-2 text-sm">• Technical Communication</li>
                <li className="flex items-center gap-2 text-sm">• Team Collaboration</li>
                <li className="flex items-center gap-2 text-sm">• Problem Solving</li>
                <li className="flex items-center gap-2 text-sm">• Proactive Learning</li>
              </ul>
            </div>

            <div className="card-base bg-neutral-50 dark:bg-neutral-900/50">
              <h3 className="text-lg font-bold mb-4">Languages</h3>
              <div className="flex flex-wrap gap-6 text-sm text-neutral-900 dark:text-neutral-400">
                <div><span className="font-bold">Bengali:</span> Native</div>
                <div><span className="font-bold">English:</span> Intermediate</div>
                <div><span className="font-bold">Hindi:</span> Intermediate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "SignFlux - Gesture to Speech",
      category: "Development / AI",
      image: "/SF.png",
      //link: "https://github.com/iamkumaresh",
      demoLink: "https://gesture-to-speech.vercel.app/"
    },
    {
      title: "Canteen Management System",
      category: "Web Development",
      image: "/CMS1.png",
      //link: "https://github.com/iamkumaresh",
      demoLink: "https://iamkumaresh.github.io/Canteen-Management-System/"
    },
    {
      title: "Simon Game",
      category: "JavaScript / Game",
      image: "/SG.png",
      //link: "https://github.com/iamkumaresh",
      demoLink: "https://iamkumaresh.github.io/Simon-Game/"
    },
    {
      title: "Spotify Clone",
      category: "Frontend",
      image: "/SC.png",
      //link: "https://github.com/iamkumaresh",
      demoLink: "https://iamkumaresh.github.io/Spotify-Clone/"
    }
    
  ];

  return (
    <section id="projects" className="py-24 md:py-32 overflow-hidden">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-800 dark:text-neutral-400 mb-4 block">Selected Work</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold">Technical Projects</h2>
          </motion.div>
          <motion.a 
            href="https://github.com/iamkumaresh" 
            target="_blank"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ x: 10 }}
            className="flex items-center gap-2 text-sm font-medium border-b border-neutral-900 dark:border-neutral-50 pb-1"
          >
            GitHub Profile <ExternalLink size={14} />
          </motion.a>
        </div>

        <div className="relative">
          <div className="flex overflow-x-auto pb-12 gap-6 md:gap-8 snap-x snap-mandatory no-scrollbar scroll-smooth">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -15 }}
                onClick={() => window.open(project.demoLink, "_blank", "noopener,noreferrer")}
                className="group cursor-pointer min-w-[300px] sm:min-w-[380px] md:min-w-[450px] snap-start"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl mb-4 bg-neutral-100 dark:bg-neutral-900">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-colors duration-500" />
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-1 leading-tight">{project.title}</h3>
                    <p className="text-sm text-neutral-800 dark:text-neutral-400">{project.category}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center group-hover:bg-neutral-900 dark:group-hover:bg-neutral-50 group-hover:text-white dark:group-hover:text-neutral-900 transition-all shrink-0 ml-2">
                    <ExternalLink size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Scroll indicators */}
          <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-2">
            <div className="w-12 h-1 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-neutral-900 dark:bg-neutral-50"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-2xl mx-auto mt-20"
    >
      <div className="bg-white dark:bg-neutral-950 p-8 md:p-12 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-neutral-200/50 dark:shadow-black/50">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-500 ml-1">Full Name</label>
              <input
                required
                type="text"
                id="name"
                name="name"
                placeholder="Kumaresh Jana"
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-500 ml-1">Email Address</label>
              <input
                required
                type="email"
                id="email"
                name="email"
                placeholder="kumaresh@gmail.com"
                className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-500 ml-1">Subject</label>
            <input
              required
              type="text"
              id="subject"
              name="subject"
              placeholder="Project Inquiry"
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-xs uppercase tracking-widest font-bold text-neutral-500 dark:text-neutral-500 ml-1">Message</label>
            <textarea
              required
              id="message"
              name="message"
              rows={5}
              placeholder="How can I help you?"
              className="w-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-600 resize-none"
            />
          </div>

          <button
            disabled={status === "sending" || status === "success"}
            type="submit"
            className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {status === "idle" && (
              <>
                Send Message
                <Send size={20} />
              </>
            )}
            {status === "sending" && (
              <>
                Sending...
                <Loader2 size={20} className="animate-spin" />
              </>
            )}
            {status === "success" && (
              <>
                Message Sent!
                <CheckCircle size={20} />
              </>
            )}
            {status === "error" && "Try Again"}
          </button>
          
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-emerald-600 dark:text-emerald-400 font-medium"
            >
              Thank you! I'll get back to you soon.
            </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-24 md:py-32 px-4">
      <div className="max-w-7xl mx-auto bg-neutral-100 dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-[2rem] md:rounded-[3rem] p-8 md:p-20 text-center relative overflow-hidden border border-neutral-200 dark:border-neutral-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative z-10"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-16 leading-[0.85] tracking-tighter"
          >
            Let's build something <br />
            <span className="italic text-neutral-800 dark:text-neutral-400">extraordinary</span> together.
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-start mb-16">
            <div className="space-y-2">
              <span className="block text-neutral-800 dark:text-neutral-400 text-xs uppercase tracking-widest">Location</span>
              <span className="text-xl font-medium">Arambagh, Hooghly, India</span>
            </div>
            
            <div className="space-y-2">
              <span className="block text-neutral-800 dark:text-neutral-400 text-xs uppercase tracking-widest">Call Me</span>
              <a href="tel:+918159828371" className="text-xl font-medium hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center justify-center gap-2">
                <Phone size={18} /> +91 8159828371
              </a>
            </div>

            <div className="space-y-2 lg:col-span-1 md:col-span-2 lg:col-start-3">
              <span className="block text-neutral-800 dark:text-neutral-400 text-xs uppercase tracking-widest">Email me</span>
              <a href="mailto:kumaresh2106@gmail.com" className="text-xl font-medium border-b border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white transition-colors pb-1">
                kumaresh2106@gmail.com
              </a>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {[
              { icon: <Github size={24} />, link: "https://github.com/iamkumaresh" },
              { icon: <Linkedin size={24} />, link: "https://www.linkedin.com/in/kumaresh-jana-050406k" },
              { icon: <Facebook size={24} />, link: "https://www.facebook.com/share/18MBiWw7D3/" },
              { icon: <Instagram size={24} />, link: "https://www.instagram.com/_kumares_h" },
              { icon: <Mail size={24} />, link: "mailto:kumaresh2106@gmail.com" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.link}
                target="_blank"
                whileHover={{ y: -5 }}
                className="text-neutral-800 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          <ContactForm />
        </motion.div>
            
        {/* Decorative background for contact section */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neutral-200/20 dark:bg-white/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neutral-200/20 dark:bg-white/5 rounded-full blur-3xl -z-10" />
      </div>
    </section>
  );
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-6 text-neutral-700 dark:text-neutral-400 text-sm border-t border-neutral-100 dark:border-neutral-800 mt-12 relative">
      <div className="section-container flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2026 Kumaresh Jana. Built with passion ⁠♡⁠‿⁠♡</p>
        <div className="flex items-center gap-8">
          <p className="flex items-center gap-2"><Phone size={14} /> +91 8159828371</p>
          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 dark:hover:bg-neutral-50 hover:text-white dark:hover:text-neutral-900 transition-all shadow-sm"
            aria-label="Back to top"
          >
            <ChevronUp size={16} />
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default function Portfolio() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}
