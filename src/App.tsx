import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import type { Variants } from 'framer-motion';
import './App.css';

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

function App() {
  const [isHeroHovered, setIsHeroHovered] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
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
        <div className="logo">F8©</div>
        <div className="menu-trigger">INDEX / WORK</div>
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
          <img src="/hero-bg.png" alt="Cinematic" />
        </motion.div>
        
        <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
          <span className="hero-sub">CINEMATIC PRODUCTION HOUSE</span>
          <h1 className="hero-title">F8.</h1>
          <div style={{ display: 'flex', gap: '4rem', justifyContent: 'center' }}>
            <span className="mono">EST. 2024</span>
            <span className="mono">MANCHESTER / UK</span>
          </div>
        </motion.div>
      </section>

      <section className="reel-section">
        <div className="container" style={{ marginBottom: '5rem' }}>
          <span className="mono">01 — PROJECT REEL</span>
          <h2 style={{ fontSize: '10vw', lineHeight: 0.9 }}>THE WORK.</h2>
        </div>
        
        <div className="reel-grid">
          {[
            { title: "NOIR", cat: "FASHION", img: "/portfolio-1.png" },
            { title: "SILHOUETTE", cat: "COMMERCIAL", img: "/portfolio-2.png" },
            { title: "APEX", cat: "ATHLETE", img: "/portfolio-3.png" },
            { title: "STUDIO", cat: "PRODUCTION", img: "/hero-bg.png" }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="reel-item"
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 1 }}
              viewport={{ once: true }}
            >
              <img src={item.img} alt={item.title} />
              <div className="reel-info">
                <span className="mono" style={{ color: 'white' }}>{item.cat}</span>
                <h3 style={{ fontSize: '3rem', color: 'white' }}>{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container section" style={{ borderTop: 'none' }}>
        <div style={{ marginBottom: '10rem' }}>
          <span className="mono">02 — CAPABILITIES</span>
          <h2 style={{ fontSize: '10vw', lineHeight: 0.9 }}>EXPERTISE.</h2>
        </div>

        <div className="expertise-list">
          {[
            { title: "BRAND FILMS", desc: "NARRATIVE CINEMATOGRAPHY FOR GLOBAL BRANDS." },
            { title: "ADVERTISING", desc: "HIGH-IMPACT VISUAL ASSETS FOR ALL PLATFORMS." },
            { title: "POST-PRODUCTION", desc: "PREMIUM COLOR GRADING AND MOTION DESIGN." },
            { title: "DIRECTION", desc: "CREATIVE STRATEGY FROM CONCEPT TO COMPLETION." }
          ].map((item, idx) => (
            <motion.div 
              key={idx} 
              className="service-row"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
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
        <div>
          <span className="mono">CONNECT</span>
          <p style={{ fontSize: '2rem', marginTop: '1rem', fontWeight: 900 }}>HELLO@F8.COM</p>
          <p style={{ fontSize: '2rem', fontWeight: 900 }}>+44 700 000 000</p>
        </div>
        <div>
          <span className="mono">FOLLOW</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <a href="#" className="mono">INSTAGRAM</a>
            <a href="#" className="mono">TWITTER</a>
            <a href="#" className="mono">LINKEDIN</a>
          </div>
        </div>
        <div>
          <span className="mono">LOCATION</span>
          <p style={{ marginTop: '1rem' }}>MANCHESTER, UK<br/>53.4808° N, 2.2426° W</p>
        </div>
        <div className="footer-logo">F8.</div>
      </footer>
    </div>
  );
}

export default App;
