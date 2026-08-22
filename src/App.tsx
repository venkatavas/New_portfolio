import { lazy, Suspense } from 'react'
import { ReducedMotionProvider } from '@/components/system/ReducedMotionProvider'
import { SmoothScrollProvider } from '@/components/system/SmoothScrollProvider'
import { CustomCursor } from '@/components/system/CustomCursor'
import { GrainBackground } from '@/components/system/GrainBackground'
import { ScrollProgress } from '@/components/system/ScrollProgress'
import { Preloader } from '@/components/preloader/Preloader'
import { SectionConnector } from '@/components/system/SectionConnector'
import { LazyMount } from '@/components/system/LazyMount'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { HeroProjectsShowcase } from '@/sections/HeroProjectsShowcase'
import { useAppEntered } from '@/hooks/useAppEntered'
import { links } from '@/data/links'

// Hero and Projects are the critical path and stay eager. Everything below
// them is real content the user will always reach on this single scrolling
// page — never conditionally skipped — so this isn't route-based splitting,
// it's just keeping their JS and GSAP/ScrollTrigger setup out of the
// initial bundle and off the main thread until each one is actually close
// to the viewport (see LazyMount).
const About = lazy(() => import('@/sections/About').then((m) => ({ default: m.About })))
const Experience = lazy(() =>
  import('@/sections/Experience').then((m) => ({ default: m.Experience })),
)
const TechStack = lazy(() => import('@/sections/TechStack').then((m) => ({ default: m.TechStack })))
const Education = lazy(() =>
  import('@/sections/Education').then((m) => ({ default: m.Education })),
)
const Contact = lazy(() => import('@/sections/Contact').then((m) => ({ default: m.Contact })))

function App() {
  const entered = useAppEntered()

  return (
    <ReducedMotionProvider>
      <SmoothScrollProvider>
        <GrainBackground />
        <ScrollProgress />
        <CustomCursor />
        {/* Inert until the preloader is dismissed so keyboard/AT users can't
            tab into content that's still visually hidden behind it — the
            preloader's own ENTER button is the only reachable control until
            then (see Preloader.tsx). */}
        <div id="app-shell" inert={!entered}>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <Nav />
          <main id="main">
            {/* The Hero's own <h1> (the kinetic name) is `autoAlpha`-hidden
                by the pinned choreography once the user scrolls past it —
                correct for that decorative element, but it means the page
                has no visible h1 for most of its scroll length. This one is
                the real, permanent landmark heading; visually hidden since
                the Hero already establishes identity visually. */}
            <h1 className="visually-hidden">{links.name}, Software Engineer</h1>
            <HeroProjectsShowcase />
            <SectionConnector />
            <LazyMount id="about">
              <Suspense fallback={null}>
                <About />
              </Suspense>
            </LazyMount>
            <SectionConnector />
            <LazyMount id="experience">
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            </LazyMount>
            <SectionConnector />
            <LazyMount id="stack">
              <Suspense fallback={null}>
                <TechStack />
              </Suspense>
            </LazyMount>
            <SectionConnector variant="converge" />
            <LazyMount id="education">
              <Suspense fallback={null}>
                <Education />
              </Suspense>
            </LazyMount>
            <SectionConnector variant="converge" />
            <LazyMount id="contact">
              <Suspense fallback={null}>
                <Contact />
              </Suspense>
            </LazyMount>
          </main>
          <Footer />
        </div>
        <Preloader />
      </SmoothScrollProvider>
    </ReducedMotionProvider>
  )
}

export default App
