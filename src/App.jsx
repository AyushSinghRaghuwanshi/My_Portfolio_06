import { useState, useEffect } from 'react'
import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import About        from './components/About'
import Experience   from './components/Experience'
import Projects     from './components/Projects'
import Skills       from './components/Skills'
import Education    from './components/Education'
import Certifications from './components/Certifications'
import Publications from './components/Publications'
import Volunteering from './components/Volunteering'
import Awards       from './components/Awards'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

export default function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="relative bg-dark text-white overflow-x-hidden">
      {/* Subtle noise texture overlay */}
      <div className="noise-overlay" aria-hidden />

      {/* Global ambient blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blob-purple opacity-60 pointer-events-none z-0" aria-hidden />
      <div className="fixed bottom-1/3 right-0 w-[600px] h-[600px] blob-cyan opacity-40 pointer-events-none z-0" aria-hidden />

      <Navbar scrolled={scrolled} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Certifications />
        <Publications />
        <Volunteering />
        <Awards />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
