import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import type { Variants } from 'framer-motion';
import './App.css';
import ServiceDetail from './ServiceDetail';

// Text Reveal Component for the Philosophy section
const RevealText = ({ text }: { text: string }) => {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "start 20%"]
  });

  const words = useMemo(() => text.split(" "), [text]);

  return (
    <h2 ref={containerRef} className="philosophy-huge">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
        
        return (
          <motion.span key={i} style={{ opacity, display: 'inline-block', marginRight: '0.25em' }}>
            {word}
          </motion.span>
        );
      })}
    </h2>
  );
};

const YouTubePlayer = ({ 
  id, 
  title, 
  type = 'video',
  isPlaying,
  onPlay
}: { 
  id: string, 
  title: string, 
  type?: 'video' | 'short',
  isPlaying: boolean,
  onPlay: () => void
}) => {
  return (
    <div className={`video-wrapper ${type}`}>
      {!isPlaying ? (
        <div className="video-placeholder" onClick={onPlay}>
          <img 
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`} 
            alt={title} 
            loading="lazy"
            onLoad={(e) => {
              // YouTube returns a 120x90 placeholder if maxresdefault doesn't exist
              if ((e.target as HTMLImageElement).naturalWidth === 120) {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
              }
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
            }}
          />
          <div className="video-overlay">
            <div className="play-button">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="viewfinder-overlay">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
            <div className="rec-dot">REC</div>
          </div>
        </div>
      ) : (
        <div className="iframe-container">
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <div className="viewfinder-overlay persistent">
            <div className="corner top-left"></div>
            <div className="corner top-right"></div>
            <div className="corner bottom-left"></div>
            <div className="corner bottom-right"></div>
          </div>
        </div>
      )}
    </div>
  );
};

function MainApp() {
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [showAllWorks, setShowAllWorks] = useState(false);
  const [showAllShorts, setShowAllShorts] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  const parallaxX = useTransform(smoothMouseX, [0, window.innerWidth], [-20, 20]);
  const parallaxY = useTransform(smoothMouseY, [0, window.innerHeight], [-20, 20]);

  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.2]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    const savedPos = sessionStorage.getItem('scrollPos');
    if (savedPos) {
      window.scrollTo(0, parseInt(savedPos));
      sessionStorage.removeItem('scrollPos');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (cursorRef.current) {
        const size = isHeroHovered ? 30 : 6;
        cursorRef.current.style.transform = `translate3d(${e.clientX - size}px, ${e.clientY - size}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHeroHovered, mouseX, mouseY]);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className="app-container">
      <div 
        ref={cursorRef}
        className={`custom-cursor active ${isHeroHovered ? 'hero-mode' : ''}`}
      />

      <nav className="nav-fixed">
        <div className="logo" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} style={{cursor: 'pointer'}}>F8©</div>
        <div className="nav-links">
          <div className="menu-trigger" onClick={() => document.querySelector('.reel-section')?.scrollIntoView({behavior: 'smooth'})}>PROJECTS</div>
          <div className="menu-trigger" onClick={() => window.open('https://wa.me/919746752566', '_blank')}>CONTACT</div>
        </div>
      </nav>

      <section 
        className="panel hero"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        <motion.div 
          className="hero-visual" 
          style={{ 
            scale: heroScale,
            x: parallaxX,
            y: parallaxY
          }}
        >
          <img src="hero-bg.png" alt="Cinematic" />
        </motion.div>
        
        <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
          <span className="hero-sub">MANCHESTER & BANGALORE BASED</span>
          <h1 className="hero-title" data-text="F8.">F8.</h1>
          <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center' }}>
            <span className="mono">EST. 2019</span>
            <span className="mono">UK / INDIA</span>
          </div>
        </motion.div>
      </section>

      <section className="identity-section container">
        <div className="identity-grid">
          <motion.div 
            className="identity-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="mono">00 — IDENTITY</span>
            <h2 className="identity-title">THE VISION.</h2>
            <div className="identity-reveal-wrapper">
              <RevealText text="F8 Production is a boutique cinematic studio born from the desire to push visual boundaries. We don't just record; we architect emotion through lens and light. Based in Manchester and Bangalore, we serve a global clientele with a unified commitment to uncompromising aesthetic quality." />
            </div>
          </motion.div>
          <motion.div 
            className="identity-stats"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="stat-item">
              <span className="mono">EST.</span>
              <span className="stat-value">2019</span>
            </div>
            <div className="stat-item">
              <span className="mono">LOCATIONS</span>
              <span className="stat-value">UK / IND</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="reel-section">
        <div className="container" style={{ marginBottom: '5rem', padding: '0 4vw' }}>
          <span className="mono">01 — PROJECT REEL</span>
          <h2 style={{ fontSize: '10vw', lineHeight: 0.9 }}>THE WORK.</h2>
        </div>
        
        <div className="reel-grid">
          {[
            { id: 'aFuFnby3_wo', title: 'EDITING SERVICES', cat: 'POST-PRODUCTION' },
            { id: 'i6_OUokibYk', title: 'CINEMATIC REEL', cat: 'DIRECTION' },
            { id: 'ASidqFXPzzY', title: 'BRAND STORY', cat: 'COMMERCIAL' },
            { id: 'bMPikiNr6sk', title: 'VISUAL NARRATIVE', cat: 'FASHION' },
            { id: '9sSTERjDYNI', title: 'URBAN CINEMA', cat: 'PRODUCTION' },
            { id: 'YA1zgduaGoY', title: 'MOTION SHOWCASE', cat: 'ADVERTISING' }
          ].slice(0, showAllWorks ? undefined : 2).map((item, idx) => (
            <motion.div 
              key={item.id} 
              className="reel-item video"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              viewport={{ once: true }}
            >
              <YouTubePlayer 
                id={item.id} 
                title={item.title} 
                isPlaying={activeVideoId === item.id}
                onPlay={() => setActiveVideoId(item.id)}
              />
              <div className="reel-info">
                <span className="mono" style={{ color: 'white' }}>{item.cat}</span>
                <h3 style={{ fontSize: '2.5rem', color: 'white', marginTop: '0.5rem' }}>{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAllWorks && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <button className="view-more-btn" onClick={() => setShowAllWorks(true)}>
              VIEW MORE
            </button>
          </div>
        )}

        <div className="container" style={{ marginTop: '10rem', marginBottom: '5rem', padding: '0 4vw' }}>
          <span className="mono">02 — VERTICALS / SHORTS</span>
          <h2 style={{ fontSize: '8vw', lineHeight: 0.9 }}>QUICK CUTS.</h2>
        </div>

        <div className="shorts-grid">
          {[
            { id: '6V_6PG4zm-M', title: 'PRODUCTION HIGHLIGHTS', cat: 'VIDEO' },
            { id: 'PKqrxlI3FKY', title: 'BEHIND THE SCENES', cat: 'BTS' },
            { id: 'ZULwzv6Iu1Q', title: 'SET LIFE', cat: 'BTS' },
            { id: 'RYkrCfyEg-A', title: 'VISUAL SNIPPET', cat: 'SHORTS' },
            { id: 'CY6eV037cQM', title: 'STREET STYLE', cat: 'SHORTS' },
            { id: '0E9dvrVVo5w', title: 'URBAN FLOW', cat: 'SHORTS' },
            { id: '3VT2W7ok3oc', title: 'MOTION CAPTURE', cat: 'SHORTS' }
          ].slice(0, showAllShorts ? undefined : 4).map((item, idx) => (
            <motion.div 
              key={item.id} 
              className="reel-item short"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <YouTubePlayer 
                id={item.id} 
                title={item.title} 
                type="short" 
                isPlaying={activeVideoId === item.id}
                onPlay={() => setActiveVideoId(item.id)}
              />
              <div className="reel-info">
                <span className="mono" style={{ color: 'white', fontSize: '0.7rem' }}>{item.cat}</span>
                <h3 style={{ fontSize: '1.2rem', color: 'white', marginTop: '0.2rem' }}>{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {!showAllShorts && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
            <button className="view-more-btn" onClick={() => setShowAllShorts(true)}>
              VIEW MORE
            </button>
          </div>
        )}
      </section>

      <section className="container section" style={{ borderTop: 'none', padding: '10rem 4vw' }}>
        <div style={{ marginBottom: '10rem' }}>
          <span className="mono">03 — CAPABILITIES</span>
          <h2 style={{ fontSize: '10vw', lineHeight: 0.9 }}>EXPERTISE.</h2>
        </div>

        <div className="expertise-list">
          {[
            { title: "BRAND FILMS", desc: "NARRATIVE CINEMATOGRAPHY FOR GLOBAL BRANDS.", slug: 'brand-films' },
            { title: "ADVERTISING", desc: "HIGH-IMPACT VISUAL ASSETS FOR ALL PLATFORMS.", slug: 'advertising' },
            { title: "POST-PRODUCTION", desc: "PREMIUM COLOR GRADING AND MOTION DESIGN.", slug: 'post-production' },
            { title: "DIRECTION", desc: "CREATIVE STRATEGY FROM CONCEPT TO COMPLETION.", slug: 'direction' }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="service-row"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              onClick={() => {
                sessionStorage.setItem('scrollPos', window.scrollY.toString());
                navigate(`/service/${item.slug}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              <span className="mono">0{idx + 1}</span>
              <h3 className="service-title">{item.title}</h3>
              <p className="mono">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="philosophy-panel">
        <RevealText text="WE BELIEVE THAT EVERY FRAME IS A DECISION. WE DON'T JUST CAPTURE MOTION; WE CAPTURE EMOTION." />
      </section>

      <footer className="footer-arc">
        <div className="footer-group">
          <span className="mono footer-label">CONNECT</span>
          <div className="footer-links">
            <p 
              className="footer-link"
              onClick={() => window.open('https://wa.me/919746752566', '_blank')}
            >
              WHATSAPP US
            </p>
          </div>
        </div>
        <div>
          <span className="mono">FOLLOW</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <a href="#" className="mono">INSTAGRAM</a>
          </div>
        </div>
        <div>
          <span className="mono">LOCATIONS</span>
          <p style={{ marginTop: '1rem' }}>MANCHESTER, UK<br/>BANGLORE, INDIA</p>
        </div>
        <div className="footer-logo">F8.</div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/service/:slug" element={<ServiceDetail />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
