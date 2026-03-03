import React, { useState, useEffect, useRef } from "react";
import profileImg from "./assets/profile.png";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub, FiLinkedin, FiMail, FiPhone, FiMenu, FiX,
  FiExternalLink, FiCode, FiServer, FiDatabase, FiTool,
  FiDownload, FiChevronDown, FiMapPin, FiBriefcase
} from "react-icons/fi";
import { Container, Col } from 'react-bootstrap';
import "./index.css";

/* ─────────────────────────  data  ───────────────────────── */
const NAV_LINKS = ["About", "Skills", "Experience", "Projects", "Contact"];

const SKILLS = {
  Frontend: [
    { name: "React.js", level: 90, icon: "⚛️" },
    { name: "JavaScript", level: 88, icon: "🟨" },
    { name: "HTML5 / CSS3", level: 92, icon: "🌐" },
    { name: "Tailwind CSS", level: 85, icon: "💨" },
    { name: "Bootstrap", level: 80, icon: "🅱️" },
    { name: "React Router", level: 85, icon: "🔀" },
  ],
  Backend: [
    { name: "Node.js", level: 85, icon: "🟢" },
    { name: "Express.js", level: 84, icon: "🚀" },
    { name: "REST API", level: 88, icon: "🔌" },
  ],
  Database: [
    { name: "MongoDB", level: 82, icon: "🍃" },
    { name: "MySQL", level: 78, icon: "🐬" },
  ],
  Tools: [
    { name: "Git / GitHub", level: 85, icon: "🐙" },
    { name: "Postman", level: 80, icon: "📮" },
    { name: "VS Code", level: 90, icon: "💙" },
    { name: "Nodemon", level: 80, icon: "👁️" },
  ],
};

// const SKILL_ICONS = { Frontend: FiCode, Backend: FiServer, Database: FiDatabase, Tools: FiTool };

const PROJECTS = [
  {
    title: "E-Commerce Web Application",
    stack: "MERN Stack",
    description:
      "Built a full-stack e-commerce platform featuring user and admin dashboards, product management, cart functionality, and complete order handling with a clean responsive UI.",
    tags: ["React", "Node.js", "Express", "MongoDB", "REST API"],
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    icon: "🛍️",
    github: "https://github.com/harihararajasudhan",
    live: "#"
  },
  {
    title: "Personal Portfolio Website",
    stack: "React.js",
    description:
      "Developed a responsive, animated personal portfolio website using React with modern UI design principles including smooth animations, dark mode aesthetics, and mobile-first layout.",
    tags: ["React", "Tailwind CSS", "Framer Motion", "Responsive"],
    color: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30",
    icon: "💼",
    github: "https://github.com/harihararajasudhan/Hari-hara-raja-sudhan_Portfolio",
    live: "#"
  },
  {
    title: "HTML Case Study",
    stack: "HTML5",
    description: "A comprehensive investigation into semantic HTML elements, structure, and web accessibility principles for structured content delivery.",
    tags: ["HTML5", "Semantic UI", "Accessibility"],
    color: "from-orange-500/20 to-red-600/20",
    border: "border-orange-500/30",
    icon: "📄",
    github: "https://github.com/harihararajasudhan/html-case-study",
    live: "#"
  },
  {
    title: "CSS Design System",
    stack: "CSS3 / Flexbox",
    description: "Advanced CSS layout study utilizing Flexbox and Grid to create complex, responsive, and maintainable user interfaces with modern aesthetics.",
    tags: ["CSS3", "Flexbox", "Responsive Design"],
    color: "from-blue-500/20 to-indigo-600/20",
    border: "border-blue-500/30",
    icon: "🎨",
    github: "https://github.com/harihararajasudhan/css-Case-study",
    live: "#"
  },
  {
    title: "SQL Database Analysis",
    stack: "MySQL",
    description: "In-depth relational database case study focusing on data modeling, relationship mapping, and optimized query structures using MySQL.",
    tags: ["SQL", "MySQL", "Database Design"],
    color: "from-green-500/20 to-emerald-600/20",
    border: "border-green-500/30",
    icon: "🗄️",
    github: "https://github.com/harihararajasudhan/-SQL-Case-Study",
    live: "#"
  },
];

const CONTACT_LINKS = [
  {
    label: "Email",
    value: "harirajmohan21@gmail.com",
    href: "mailto:harirajmohan21@gmail.com",
    icon: FiMail,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 hover:bg-cyan-500/20",
    border: "border-cyan-500/30",
  },
  {
    label: "Phone",
    value: "+91 7094171321",
    href: "tel:+917094171321",
    icon: FiPhone,
    color: "text-green-400",
    bg: "bg-green-500/10 hover:bg-green-500/20",
    border: "border-green-500/30",
  },
  {
    label: "GitHub",
    value: "github.com/harihararajasudhan",
    href: "https://github.com/harihararajasudhan",
    icon: FiGithub,
    color: "text-white",
    bg: "bg-white/5 hover:bg-white/10",
    border: "border-white/20",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/harihararajasudhan-r",
    href: "https://www.linkedin.com/in/harihararajasudhan-r-630b28275",
    icon: FiLinkedin,
    color: "text-blue-400",
    bg: "bg-blue-500/10 hover:bg-blue-500/20",
    border: "border-blue-500/30",
  },
];

/* ─────────────────────────  helpers  ─────────────────────── */
const EASE_ELASTIC = [0.25, 1, 0.5, 1];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.8, delay, ease: EASE_ELASTIC },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: 0.7, delay },
});

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_ELASTIC } }
};

function SectionWrapper({ id, children }) {
  const ref = useRef(null);

  return (
    <section id={id} ref={ref} className="py-28 px-6 relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: EASE_ELASTIC }}
        className="max-w-6xl mx-auto"
      >
        {children}
      </motion.div>
    </section>
  );
}

function SectionTitle({ label, title }) {
  return (
    <div className="text-center mb-16">
      <span className="text-cyan-400 text-sm font-semibold tracking-[0.3em] uppercase mb-3 block">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold font-display text-gradient">
        {title}
      </h2>
      <div className="mt-4 flex justify-center gap-1">
        <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
        <div className="w-3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </div>
    </div>
  );
}

/* ─────────────────────────  APP  ─────────────────────────── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");

  const [msgSent, setMsgSent] = useState(false);

  const roles = ["MERN Stack Developer", "Full Stack Engineer", "React.js Developer", "Node.js Developer"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // Typewriter
  useEffect(() => {
    const current = roles[roleIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), 80);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), 45);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setRoleIdx(i => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIdx, deleting, roleIdx]);

  // Navbar scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll spy
  useEffect(() => {
    const ids = ["about", "skills", "experience", "projects", "contact"];
    const onScroll = () => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const { top, bottom } = el.getBoundingClientRect();
          if (top <= 160 && bottom >= 160) setActiveSection(id);
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSend = e => {
    e.preventDefault();
    const form = e.target;
    const data = {
      name: form.name.value,
      email: form.email.value,
      message: form.message.value,
    };
    axios.post(`${process.env.REACT_APP_API_URL}/contact`, data)
      .then(() => setMsgSent(true))
      .catch(err => console.error(err));
    setTimeout(() => setMsgSent(false), 3500);
    form.reset();
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="bg-[#080810] text-white min-h-screen overflow-x-hidden"
    >

      {/* ── CYBERPUNK AURORA BACKGROUND ─────────── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Base dark layer */}
        <div className="absolute inset-0 bg-[#080810]" />

        {/* Animated Grid */}
        <div className="absolute inset-0 grid-bg opacity-[0.15]" />

        {/* Aurora Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-cyan-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[110px]"
        />

        {/* Subtle noise/texture overlay if desired */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none brightness-150 contrast-150" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      </div>

      {/* ── NAVBAR ─────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#080810]/90 backdrop-blur-xl border-b border-white/8 shadow-lg shadow-black/30" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.a
            href="#"
            {...fadeIn(0.1)}
            className="text-xl font-bold font-display text-gradient"
          >
            &lt;Hari.dev /&gt;
          </motion.a>

          {/* Desktop nav */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="hidden md:flex gap-8 items-center"
          >
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link}
                variants={staggerItem}
                href={`#${link.toLowerCase()}`}
                className={`text-sm font-medium transition-all duration-300 relative group ${activeSection === link.toLowerCase()
                  ? "text-cyan-400"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {link}
                <span className={`absolute -bottom-1 left-0 h-px bg-cyan-400 transition-all duration-300 ${activeSection === link.toLowerCase() ? "w-full" : "w-0 group-hover:w-full"}`} />
              </motion.a>
            ))}
            <motion.a
              variants={staggerItem}
              whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.95 }}
              href="/resume.pdf"
              download
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20"
            >
              <FiDownload size={14} />
              Resume
            </motion.a>
          </motion.div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors p-1 relative z-[70] pointer-events-auto"
          >
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0d0d1a]/98 backdrop-blur-2xl border-t border-white/8 overflow-hidden relative z-[60] w-full"
            >
              <div className="px-6 py-5 flex flex-col gap-4 relative z-[75] pointer-events-auto">
                {NAV_LINKS.map(link => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = link.toLowerCase();
                      setMenuOpen(false);

                      // Small delay to allow the menu close state to start
                      // and prevent animation interference
                      setTimeout(() => {
                        const element = document.getElementById(id);
                        if (element) {
                          const yOffset = -80; // Navbar height offset
                          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }, 200);
                    }}
                    className="text-gray-300 hover:text-cyan-400 transition-colors capitalize font-medium py-3 block w-full px-2"
                  >
                    {link}
                  </a>
                ))}
                <a href="/resume.pdf" download className="flex items-center gap-2 text-cyan-400 font-semibold">
                  <FiDownload size={14} /> Download Resume
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Left – text */}
          <div>
            <motion.div {...fadeUp(0.1)} className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-cyan-400" />
              <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase">
                Welcome to my portfolio
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.25)}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-display leading-tight mb-4"
            >
              Hari Hara<br />
              <span className="text-gradient">Raja Sudhan</span>
            </motion.h1>

            <motion.div {...fadeUp(0.4)} className="text-2xl md:text-3xl font-semibold text-gray-300 mb-6 h-10">
              <span className="text-cyan-400">{roles[roleIdx].slice(0, charIdx)}</span>
              <span className="animate-pulse text-cyan-400">|</span>
            </motion.div>

            <motion.p {...fadeUp(0.5)} className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl">
              Results-driven MERN Stack Developer with 6 months of industry experience.
              Passionate about building scalable, clean, and performant web applications.
            </motion.p>

            <motion.div {...fadeUp(0.6)} className="flex flex-wrap gap-4 mb-10">
              <motion.a
                whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="px-7 py-3 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-xl font-bold text-white hover:opacity-90 transition-all duration-300 shadow-xl shadow-cyan-500/30"
              >
                Get In Touch
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="px-7 py-3 border border-white/20 rounded-xl font-semibold hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300"
              >
                View Projects
              </motion.a>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex gap-5"
            >
              {[
                { href: "https://github.com/harihararajasudhan", icon: FiGithub, label: "GitHub" },
                { href: "https://www.linkedin.com/in/harihararajasudhan-r-630b28275", icon: FiLinkedin, label: "LinkedIn" },
                { href: "mailto:harirajmohan21@gmail.com", icon: FiMail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  variants={staggerItem}
                  whileHover={{ scale: 1.2, rotate: 5, color: "#22d3ee" }}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-11 h-11 glass-card rounded-xl flex items-center justify-center text-gray-400 hover:border-cyan-400/40 transition-all duration-300"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right – avatar card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex justify-center"
          >
            <div className="relative">
              {/* Spinning ring */}
              <div className="absolute inset-[-16px] rounded-full border-2 border-dashed border-cyan-400/30 animate-spin-slow" />
              {/* Avatar circle */}
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-cyan-400/30 pulse-glow float-anim">
                <img src={profileImg} alt="Hari Hara Raja Sudhan" className="w-full h-full object-cover" />
              </div>

              {/* Floating badges */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 glass-card border border-cyan-400/30 rounded-xl px-3 py-2 text-xs font-semibold text-cyan-400"
              >
                ⚡ Open to Work
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 glass-card border border-purple-400/30 rounded-xl px-3 py-2 text-xs font-semibold text-purple-400"
              >
                🚀 6 Months Exp.
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <FiChevronDown size={20} />
        </motion.div>
      </section>

      {/* ── ABOUT ──────────────────────────────────── */}
      <SectionWrapper id="about">
        <SectionTitle label="Who I Am" title="About Me" />
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              I'm a passionate <span className="text-cyan-400 font-semibold">MERN Stack Developer</span> with
              hands-on experience building full-stack web applications. I thrive on turning complex problems
              into elegant, user-friendly solutions.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              With expertise spanning React.js, Node.js, Express.js, and MongoDB, I focus on writing clean,
              scalable, and maintainable code. I'm equally comfortable designing responsive UIs and architecting
              robust REST APIs.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { icon: FiMapPin, text: "Tamil Nadu, India" },
                { icon: FiPhone, text: "+91 7094171321" },
                { icon: FiMail, text: "harirajmohan21@gmail.com" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 glass-card border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300">
                  <Icon size={14} className="text-cyan-400 shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "6+", label: "Months Experience", color: "from-cyan-500 to-blue-600" },
              { value: "2+", label: "Projects Completed", color: "from-purple-500 to-pink-600" },
              { value: "10+", label: "Technologies Used", color: "from-blue-500 to-cyan-600" },
              { value: "100%", label: "Dedication", color: "from-green-500 to-teal-600" },
            ].map(({ value, label, color }) => (
              <div key={label} className="glass-card border border-white/8 rounded-2xl p-6 text-center hover:border-cyan-400/30 transition-colors">
                <div className={`text-4xl font-extrabold font-display bg-gradient-to-r ${color} bg-clip-text text-transparent mb-2`}>
                  {value}
                </div>
                <p className="text-gray-400 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* ── SKILLS ─────────────────────────────────── */}
      <SectionWrapper id="skills">
        <SectionTitle label="What I Know" title="Technical Skills" />

        {(() => {
          const categoryMeta = {
            Frontend: { gradient: "from-cyan-500 to-blue-500", glow: "shadow-cyan-500/20", border: "border-cyan-500/25", icon: FiCode },
            Backend: { gradient: "from-violet-500 to-purple-600", glow: "shadow-purple-500/20", border: "border-purple-500/25", icon: FiServer },
            Database: { gradient: "from-green-500 to-teal-500", glow: "shadow-green-500/20", border: "border-green-500/25", icon: FiDatabase },
            Tools: { gradient: "from-orange-500 to-pink-500", glow: "shadow-orange-500/20", border: "border-orange-500/25", icon: FiTool },
          };

          return (
            <Container>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-50px" }}
                className="row g-4"
              >
                {Object.entries(SKILLS).map(([cat, items], ci) => {
                  const { gradient, glow, border, icon: CatIcon } = categoryMeta[cat];
                  return (
                    <Col key={cat} xs={12} sm={6} lg={3} className="d-flex">
                      <motion.div
                        variants={staggerItem}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        className={`glass-card border ${border} rounded-2xl h-100 overflow-hidden shadow-xl ${glow} flex-fill`}
                      >
                        {/* Category header */}
                        <div className={`bg-gradient-to-r ${gradient} p-4 flex items-center gap-3`}>
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <CatIcon size={16} className="text-white" />
                          </div>
                          <span className="font-bold text-white font-display tracking-wide">{cat}</span>
                        </div>

                        {/* Skill chips */}
                        <div className="p-4 flex flex-col gap-2">
                          {items.map(({ name, icon }, si) => (
                            <motion.div
                              key={name}
                              whileHover={{ x: 6, backgroundColor: "rgba(255,255,255,0.08)" }}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8 hover:border-white/20 transition-all duration-200 cursor-default`}
                            >
                              <span className="text-lg leading-none">{icon}</span>
                              <span className="text-sm font-medium text-gray-200">{name}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </Col>
                  );
                })}
              </motion.div>
            </Container>
          );
        })()}
      </SectionWrapper>

      {/* ── EXPERIENCE ─────────────────────────────── */}
      <SectionWrapper id="experience">
        <SectionTitle label="My Journey" title="Experience" />

        <div className="max-w-3xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative pl-8 border-l-2 border-cyan-400/20"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50" />

            <motion.div
              variants={staggerItem}
              className="glass-card border border-cyan-400/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className="text-xl font-bold text-white font-display mb-1">
                    Full Stack Developer Intern
                  </h3>
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <FiBriefcase size={14} />
                    UK Info Tech, Pudukkottai
                  </div>
                </div>
                <span className="px-4 py-1.5 bg-cyan-500/15 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold whitespace-nowrap">
                  6 Months
                </span>
              </div>

              <ul className="space-y-3">
                {[
                  "Developed and maintained full-stack applications using the MERN stack (MongoDB, Express.js, React.js, Node.js)",
                  "Designed and implemented RESTful APIs with robust database integration and data validation",
                  "Collaborated with team members to deliver responsive, user-friendly web interfaces",
                  "Optimized application performance and resolved technical bugs to improve stability and UX",
                ].map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 mt-5">
                {["MongoDB", "Express.js", "React.js", "Node.js", "REST API", "MySQL"].map(t => (
                  <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* ── PROJECTS ───────────────────────────────── */}
      <SectionWrapper id="projects">
        <SectionTitle label="What I've Built" title="Projects" />

        <Container>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="row g-4"
          >
            {PROJECTS.map((proj, i) => (
              <Col key={proj.title} xs={12} md={6}>
                <motion.div
                  variants={staggerItem}
                  whileHover={{ y: -10, transition: { duration: 0.4, ease: EASE_ELASTIC } }}
                  className={`glass-card border ${proj.border} rounded-2xl h-100 overflow-hidden group transition-shadow duration-500 hover:shadow-2xl hover:shadow-cyan-500/10`}
                >
                  {/* Card header gradient */}
                  <div className={`bg-gradient-to-br ${proj.color} p-8 border-b ${proj.border}`}>
                    <div className="text-5xl mb-4">{proj.icon}</div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1 block">
                          {proj.stack}
                        </span>
                        <h3 className="text-xl font-bold text-white font-display">{proj.title}</h3>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a href={proj.github} target="_blank" rel="noreferrer" className="w-9 h-9 glass-card rounded-lg flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors">
                          <FiGithub size={16} />
                        </a>
                        <a href={proj.live} target="_blank" rel="noreferrer" className="w-9 h-9 glass-card rounded-lg flex items-center justify-center text-gray-400 hover:text-white cursor-pointer transition-colors">
                          <FiExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <p className="text-gray-400 leading-relaxed mb-5 text-sm">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map(t => (
                        <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </Col>
            ))}
          </motion.div>
        </Container>
      </SectionWrapper>

      {/* ── CONTACT ────────────────────────────────── */}
      <SectionWrapper id="contact">
        <SectionTitle label="Let's Talk" title="Contact Me" />

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left – info cards */}
          <div>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              I'm currently <span className="text-cyan-400 font-semibold">open to new opportunities</span>.
              Whether you have a project in mind or just want to connect, feel free to reach out!
            </p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {CONTACT_LINKS.map(({ label, value, href, icon: Icon, color, bg, border }) => (
                <motion.a
                  key={label}
                  variants={staggerItem}
                  whileHover={{ x: 8, transition: { duration: 0.3 } }}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : "_self"}
                  rel="noreferrer"
                  className={`flex items-center gap-4 ${bg} border ${border} rounded-xl p-4 transition-all duration-300 group`}
                >
                  <div className={`w-10 h-10 rounded-lg glass-card border ${border} flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                    <p className={`font-medium ${color} text-sm`}>{value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right – form */}
          <div className="glass-card border border-white/8 rounded-2xl p-8">
            <h3 className="text-lg font-bold font-display mb-6 text-white">Send a Message</h3>
            <form onSubmit={handleSend} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Your email"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none transition-colors text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Subject</label>
                <input
                  type="text"
                  placeholder="How can I help you?"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="Write your message here..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-cyan-400/60 focus:outline-none transition-colors resize-none text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 rounded-xl font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                {msgSent ? "✅ Message Sent!" : "Send Message →"}
              </button>
            </form>
          </div>
        </div>
      </SectionWrapper>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="border-t border-white/8 py-10 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gradient font-bold font-display text-lg">&lt;Hari.dev /&gt;</p>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Hari Hara Raja Sudhan R. All rights reserved.
          </p>
          <div className="flex gap-4">
            {[
              { href: "https://github.com/harihararajasudhan", icon: FiGithub },
              { href: "https://www.linkedin.com/in/harihararajasudhan-r-630b28275", icon: FiLinkedin },
              { href: "mailto:harirajmohan21@gmail.com", icon: FiMail },
            ].map(({ href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </motion.div>
  );
}