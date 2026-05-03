import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SERVICE_DATA: Record<string, { title: string; desc: string; details: string; image: string }> = {
  'brand-films': {
    title: 'BRAND FILMS',
    desc: 'NARRATIVE CINEMATOGRAPHY FOR GLOBAL BRANDS.',
    details: 'Our Brand Films are more than just commercials; they are cinematic experiences. We dive deep into your brand soul to extract stories that matter. Using state-of-the-art cinema cameras and a director-led approach, we create visuals that feel like high-end cinema while delivering your message with clarity and impact.',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop'
  },
  'advertising': {
    title: 'ADVERTISING',
    desc: 'HIGH-IMPACT VISUAL ASSETS FOR ALL PLATFORMS.',
    details: 'In a world of constant noise, we create visuals that stop the scroll. Our advertising services cover everything from high-budget TVCs to rapid-response social media assets. We focus on high-impact cinematography and rhythmic editing to ensure your brand stays in the minds of your audience long after the video ends.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop'
  },
  'post-production': {
    title: 'POST-PRODUCTION',
    desc: 'PREMIUM COLOR GRADING AND MOTION DESIGN.',
    details: 'The final edit is where the story truly comes to life. Our post-production services include precision color grading to achieve that signature cinematic look, high-end motion graphics, and meticulous sound design. We transform raw footage into a cohesive, polished masterpiece that meets the highest industry standards.',
    image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop'
  },
  'direction': {
    title: 'DIRECTION',
    desc: 'CREATIVE STRATEGY FROM CONCEPT TO COMPLETION.',
    details: 'Great films start with great direction. We provide comprehensive creative strategy and on-set direction. From conceptualizing the initial hook to guiding the final performance, our directors ensure that every frame serves the narrative and aligns with your creative vision.',
    image: 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?q=80&w=1974&auto=format&fit=crop'
  }
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const service = slug ? SERVICE_DATA[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!service) return <div className="container">Service not found</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="service-detail-page"
    >
      <div className="back-nav" onClick={() => navigate('/')}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="mono">BACK TO HOME</span>
      </div>

      <nav className="nav-fixed">
        <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>F8©</div>
      </nav>

      <section className="service-hero">
        <motion.div 
          className="service-hero-bg"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={service.image} alt={service.title} />
          <div className="overlay"></div>
        </motion.div>
        
        <div className="service-hero-content">
          <motion.span 
            className="mono"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            EXPERTISE / {service.title}
          </motion.span>
          <motion.h1 
            className="service-detail-title"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            {service.title}.
          </motion.h1>
        </div>
      </section>

      <section className="service-content container">
        <div className="service-grid">
          <motion.div 
            className="service-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="mono">{service.desc}</h2>
            <p className="service-description">{service.details}</p>
            <button className="view-more-btn" style={{ marginTop: '3rem' }} onClick={() => window.open('https://wa.me/919746752566', '_blank')}>
              START A PROJECT
            </button>
          </motion.div>
          
          <motion.div 
            className="service-visual"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <div className="viewfinder-overlay persistent">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            <img src={service.image} alt="Process" />
          </motion.div>
        </div>
      </section>

      <footer className="footer-arc">
        <div className="footer-group">
          <span className="mono footer-label">CONNECT</span>
          <div className="footer-links">
            <p className="footer-link" onClick={() => window.open('https://wa.me/919746752566', '_blank')}>WHATSAPP US</p>
          </div>
        </div>
        <div className="footer-logo">F8.</div>
      </footer>
    </motion.div>
  );
};

export default ServiceDetail;
