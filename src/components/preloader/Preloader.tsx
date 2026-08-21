import { useEffect, useRef, useState } from 'react'
import { MagneticWrapper } from '@/components/primitives/MagneticWrapper'
import { useReducedMotionContext } from '@/components/system/ReducedMotionProvider'
import { gsap } from '@/lib/gsap'
import { projects } from '@/data/content'
import { links } from '@/data/links'
import { PreloaderRobot } from './PreloaderRobot'
import { PreloaderGlobe } from './PreloaderGlobe'
import { PreloaderScanPanel } from './PreloaderScanPanel'
import './Preloader.css'

const PROJECT_COUNT = String(projects.length).padStart(2, '0')

/**
 * The site's opening gate: not a loading screen (Hero is already mounted
 * underneath, ready), but a deliberate "enter the system" cinematic
 * sequence — an autonomous agent activates the ENTER node, the system
 * locates the profile, and the same node that started it all expands into
 * the Hero. One master GSAP timeline drives every beat; nothing here
 * animates independently of it. Dispatches `app:entered` on window so
 * Hero.tsx and HeroProjectsPin.tsx know when to start their own entrance
 * timelines (useAppEntered).
 */
export function Preloader() {
  const reducedMotion = useReducedMotionContext()
  const [isExiting, setIsExiting] = useState(false)
  const [isGone, setIsGone] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const enterRef = useRef<HTMLButtonElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLSpanElement>(null)
  const connectLineRef = useRef<HTMLSpanElement>(null)
  const ringARef = useRef<HTMLSpanElement>(null)
  const ringBRef = useRef<HTMLSpanElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)

  const robotRoot = useRef<HTMLDivElement>(null)
  const robotHead = useRef<SVGGElement>(null)
  const robotEye = useRef<SVGCircleElement>(null)
  const robotUpperArm = useRef<SVGGElement>(null)
  const robotForearm = useRef<SVGGElement>(null)
  const robotLegL = useRef<SVGGElement>(null)
  const robotLegR = useRef<SVGGElement>(null)

  const globeRoot = useRef<HTMLDivElement>(null)
  const globeRings = useRef<SVGGElement>(null)
  const globeWireframe = useRef<SVGGElement>(null)
  const globeSpin = useRef<SVGGElement>(null)
  const globePulse = useRef<SVGCircleElement>(null)

  const panelRoot = useRef<HTMLDivElement>(null)
  const panelScanning = useRef<HTMLDivElement>(null)
  const panelFound = useRef<HTMLDivElement>(null)
  const panelAccess = useRef<HTMLDivElement>(null)
  const scanBarFill = useRef<HTMLSpanElement>(null)
  const scanPercent = useRef<HTMLSpanElement>(null)
  const scanline = useRef<HTMLSpanElement>(null)

  const packetRef = useRef<HTMLSpanElement>(null)

  // The robot/globe/scan-panel markup only renders once the cinematic
  // sequence is actually running — not reduced-motion, which never needs
  // any of it. Before this, Preloader's DOM is just READY + ENTER + the
  // corner metadata. Keeping ~200 SVG/DOM nodes worth of robot+globe+panel
  // out of the tree until they're about to be used (rather than mounted
  // eagerly at opacity:0) measurably cut the Style & Layout cost Lighthouse
  // charges against initial page load, since that's exactly the moment
  // none of this has been seen yet.
  //
  // This is its own state (decided once, at the moment ENTER is activated)
  // rather than derived live as `isExiting && !reducedMotion` — a live
  // derivation meant an OS-level "reduce motion" toggle flipped mid-flight
  // would flip this false, unmount the robot/globe/panel DOM out from
  // under the running timeline, and revert (kill) the timeline before its
  // onComplete could ever call setIsGone(true), permanently stranding the
  // preloader over the page. Deciding once at activation and never
  // reconsidering means a mid-sequence toggle no longer touches it.
  const [showSequence, setShowSequence] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isGone ? '' : 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isGone])

  useEffect(() => {
    if (!rootRef.current || reducedMotion) return
    const ctx = gsap.context(() => {
      gsap.from(rootRef.current, { opacity: 0, duration: 0.5, ease: 'power1.out' })
    }, rootRef)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isGone) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      handleEnter()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGone, isExiting])

  const setStatus = (text: string) => {
    if (statusRef.current) statusRef.current.textContent = text
  }

  // The master timeline itself only builds once `showSequence` has actually
  // mounted the robot/globe/panel DOM and refs are populated — this effect
  // fires after that render commits, which is exactly when GSAP needs them
  // to exist.
  useEffect(() => {
    if (!showSequence || !rootRef.current) return

    const isMobile = window.matchMedia('(max-width: 640px)').matches
    const scanProgress = { value: 0 }
    const particles = particlesRef.current ? Array.from(particlesRef.current.children) : []

    const ctx = gsap.context(() => {
      // Ambient globe rotation, deliberately NOT chained onto `tl` below.
      // `tl`'s own duration is the max end-time across everything on it,
      // and its onComplete is what unmounts the full-viewport preloader
      // overlay — a 5s decorative tween living on that same timeline would
      // hold the overlay (still intercepting clicks; it has no
      // pointer-events:none) on screen for seconds after the Hero has
      // already visually finished revealing. A standalone tween, still
      // registered to this same context so it's still cleaned up on
      // unmount, just doesn't factor into `tl`'s duration at all. The
      // delay matches the same real-time offset ('earth+0.38') it used to
      // start at.
      gsap.to(globeSpin.current, { rotation: 22, duration: 5, ease: 'none', delay: 3.38 })

      // ---- initial state ----
      gsap.set(robotRoot.current, { xPercent: -50, yPercent: -50, x: -150, y: 95, opacity: 0 })
      // svgOrigin (not CSS transformOrigin) — GSAP resolves it in the SVG's
      // own user-unit coordinate space, matching the actual joint
      // coordinates in PreloaderRobot.tsx's markup. Pixel-based
      // transformOrigin on a nested <g> was resolving against that
      // element's own local bounding box instead, rotating the arm around
      // entirely the wrong point (verified: it landed the hand ~100px from
      // the node's center instead of at its ~60px radius).
      gsap.set(robotUpperArm.current, { rotation: 8, svgOrigin: '61 46' })
      gsap.set(robotForearm.current, { rotation: 6, svgOrigin: '61 68' })
      gsap.set(robotLegL.current, { svgOrigin: '30 80' })
      gsap.set(robotLegR.current, { svgOrigin: '50 80' })
      gsap.set(robotHead.current, { svgOrigin: '40 20' })
      gsap.set([robotLegL.current, robotLegR.current], { rotation: 0 })
      gsap.set(connectLineRef.current, { opacity: 0, scaleX: 0, xPercent: -50, yPercent: -50 })
      gsap.set([ringARef.current, ringBRef.current], { opacity: 0, scale: 0.4, xPercent: -50, yPercent: -50 })
      gsap.set(particles, { opacity: 0, x: 0, y: 0 })
      gsap.set(globeRoot.current, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.5 })
      gsap.set(globeRings.current, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' })
      gsap.set(globeWireframe.current, { opacity: 0 })
      gsap.set(globeSpin.current, { opacity: 0, rotation: 0, transformOrigin: '50% 50%' })
      gsap.set(
        panelRoot.current,
        isMobile ? { xPercent: -50, opacity: 0, y: 10 } : { yPercent: -50, opacity: 0, y: 10 },
      )
      gsap.set([panelFound.current, panelAccess.current], { opacity: 0 })
      gsap.set(panelScanning.current, { opacity: 1 })
      gsap.set(scanline.current, { opacity: 0, top: '0%' })
      gsap.set('.scan-panel__letter', {
        opacity: 0,
        x: () => gsap.utils.random(-14, 14),
        y: () => gsap.utils.random(-10, 10),
      })
      gsap.set(packetRef.current, { opacity: 0, xPercent: -50, yPercent: -50, x: 0, y: 0 })
      gsap.set(statusRef.current, { xPercent: -50 })

      const tl = gsap.timeline({ onComplete: () => setIsGone(true) })

      // ---- phase 02: robot arrival (enters + approaches: ~0.8s) ----
      tl.addLabel('approach')
        .to(robotRoot.current, { opacity: 1, x: -95, y: 8, duration: 0.75, ease: 'power2.out' }, 'approach')
        .to(robotLegL.current, { rotation: 10, duration: 0.14, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 'approach')
        .to(robotLegR.current, { rotation: -10, duration: 0.14, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 'approach')
        .to(robotHead.current, { rotation: 2, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'approach+=0.15')

        // ---- phase 03: robot detects ENTER (pause + eye/sensor: 0.25s) ----
        .addLabel('detect', 'approach+=0.8')
        .call(() => setStatus('Input detected'), undefined, 'detect')
        .to(robotEye.current, { opacity: 1, duration: 0.2 }, 'detect')
        .to(connectLineRef.current, { opacity: 1, scaleX: 1, duration: 0.22, ease: 'power1.out' }, 'detect+=0.03')

        // ---- phase 04: arm extends toward ENTER (0.35s) ----
        .addLabel('reach', 'detect+=0.25')
        .to(connectLineRef.current, { opacity: 0, duration: 0.15 }, 'reach')
        .to(robotUpperArm.current, { rotation: -96, duration: 0.35, ease: 'power2.inOut' }, 'reach')
        .to(robotForearm.current, { rotation: -18, duration: 0.35, ease: 'power2.inOut' }, 'reach+=0.05')

        // ---- phase 05: contact (0.15s) — hand touches the node, ENTER
        // reacts, and the button's own label swaps to a short "Activated"
        // (never "Initializing" — that text lives only in the status line
        // below, and only once the button has gone quiet, so the two
        // never read as overlapping). ----
        .addLabel('contact', 'reach+=0.35')
        .to(
          enterRef.current,
          {
            scale: 1.08,
            duration: 0.08,
            ease: 'power2.out',
            boxShadow: '0 0 0 1px var(--color-accent), 0 0 36px 6px var(--color-accent-soft)',
          },
          'contact',
        )
        .to(enterRef.current, { scale: 1, duration: 0.1, ease: 'power2.in' }, 'contact+=0.08')
        // Sequential, not simultaneous — "Enter" fully clears before
        // "Activated" fades in. Both labels are absolutely stacked on the
        // same spot, so any overlap in their timing reads as double-
        // exposed, unreadable text (this is what "INITIALIZING / ENTER
        // overlapping" actually was: a crossfade with too much overlap).
        .to('.preloader__enter-label:not(.preloader__enter-label--active)', { opacity: 0, duration: 0.08 }, 'contact')
        .to('.preloader__enter-label--active', { opacity: 1, duration: 0.1 }, 'contact+=0.08')
        .to('[data-preloader-meta]', { opacity: 0.35, duration: 0.3 }, 'contact')

        // ---- phase 06: ENTER pulse — rings + particles (0.25s) ----
        .addLabel('contactPulse', 'contact+=0.15')
        .to(ringARef.current, { opacity: 1, scale: 1.6, duration: 0.32, ease: 'power1.out' }, 'contactPulse')
        .to(ringARef.current, { opacity: 0, duration: 0.12 }, 'contactPulse+=0.25')
        .to(ringBRef.current, { opacity: 0.6, scale: 2.1, duration: 0.4, ease: 'power1.out' }, 'contactPulse+=0.08')
        .to(ringBRef.current, { opacity: 0, duration: 0.12 }, 'contactPulse+=0.4')
        .to(
          particles,
          {
            opacity: 1,
            x: (i) => Math.cos((i / particles.length) * Math.PI * 2) * 46,
            y: (i) => Math.sin((i / particles.length) * Math.PI * 2) * 46,
            duration: 0.35,
            stagger: 0.015,
            ease: 'power1.out',
          },
          'contactPulse+=0.04',
        )
        .to(particles, { opacity: 0, duration: 0.15 }, 'contactPulse+=0.32')

        // ---- phase 07: arm retracts; button label clears (0.3s) ----
        .addLabel('retract', 'contactPulse+=0.25')
        .to(robotUpperArm.current, { rotation: 8, duration: 0.3, ease: 'power2.inOut' }, 'retract')
        .to(robotForearm.current, { rotation: 6, duration: 0.3, ease: 'power2.inOut' }, 'retract')
        .to('.preloader__enter-label--active', { opacity: 0, duration: 0.15 }, 'retract+=0.1')

        // ---- phase 08: robot exits toward the side (0.4s) ----
        .addLabel('exit', 'retract+=0.3')
        .to(robotHead.current, { rotation: -4, duration: 0.15, ease: 'sine.out' }, 'exit')
        .to(robotRoot.current, { x: 130, y: -20, opacity: 0, duration: 0.4, ease: 'power1.in' }, 'exit')

        // ---- phase 09: system initialization — only now, with the robot
        // fully gone and the button's own label cleared, does the status
        // line say anything about initializing. The node keeps a slow
        // breathing pulse through this whole window instead of sitting
        // dead on screen while only the status text changes underneath
        // it — the ENTER→NODE→EARTH handoff should read as one continuous
        // transformation, not three separate beats. ----
        .addLabel('init', 'exit+=0.4')
        .call(() => setStatus('Initializing system…'), undefined, 'init')
        .to(enterRef.current, { scale: 1.04, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'init')
        .addLabel('online', 'init+=0.3')
        .call(() => setStatus('System online'), undefined, 'online')

        // ---- phase 06: the node contracts to a point and blooms directly
        // into the globe — a single continuous gesture, not a fade-out
        // followed by a separate fade-in. ----
        .addLabel('earth', 'online+=0.2')
        .call(() => setStatus('Locating profile…'), undefined, 'earth')
        .to(
          enterRef.current,
          { scale: 0.15, duration: 0.22, ease: 'power2.in', boxShadow: '0 0 0 1px var(--color-accent), 0 0 24px 6px var(--color-accent-soft)' },
          'earth',
        )
        .to(enterRef.current, { opacity: 0, duration: 0.1 }, 'earth+=0.18')
        .to(globeRings.current, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out' }, 'earth+=0.15')
        .to(globeWireframe.current, { opacity: 1, duration: 0.25 }, 'earth+=0.28')
        .to(globeRoot.current, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 'earth+=0.2')
        .to(globeSpin.current, { opacity: 1, duration: 0.3 }, 'earth+=0.38')
        // +1s here specifically: the globe used to finish materializing at
        // almost the exact instant "Location found" fired, so it barely
        // registered as fully formed before the next beat took over. This
        // gives it real screen time on its own.
        .addLabel('located', 'earth+=1.65')
        .call(() => setStatus('Location found'), undefined, 'located')
        .to(globePulse.current, { opacity: 1, scale: 1.6, duration: 0.18, ease: 'power1.out' }, 'located')
        .to(globePulse.current, { opacity: 0.3, scale: 1, duration: 0.18 }, 'located+=0.18')
        .to(globePulse.current, { opacity: 1, scale: 1.6, duration: 0.18, ease: 'power1.out' }, 'located+=0.34')
        .to(globePulse.current, { opacity: 0.6, scale: 1, duration: 0.18 }, 'located+=0.52')

        // ---- phase 07: connection (round trip, echoes Hero's Request Lifecycle) ----
        .addLabel('connect', 'located+=0.25')
        .call(() => setStatus('Establishing connection…'), undefined, 'connect')
        .to(packetRef.current, { opacity: 1, duration: 0.08 }, 'connect')
        .to(
          packetRef.current,
          isMobile
            ? { y: 140, duration: 0.32, ease: 'power1.inOut' }
            : { x: 180, duration: 0.32, ease: 'power1.inOut' },
          'connect',
        )
        .addLabel('connected', 'connect+=0.34')
        .call(() => setStatus('Connection established'), undefined, 'connected')
        .to(panelRoot.current, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, 'connected')
        .to(
          packetRef.current,
          isMobile ? { y: 0, duration: 0.28, ease: 'power1.inOut' } : { x: 0, duration: 0.28, ease: 'power1.inOut' },
          'connected+=0.04',
        )
        .to(packetRef.current, { opacity: 0, duration: 0.1 }, 'connected+=0.28')

        // ---- phase 08: profile scan ----
        .addLabel('scan', 'connected+=0.15')
        .to(statusRef.current, { opacity: 0, duration: 0.2 }, 'scan')
        .to(
          scanProgress,
          {
            value: 100,
            duration: 0.7,
            ease: 'power1.inOut',
            onUpdate: () => {
              if (scanPercent.current) scanPercent.current.textContent = `${Math.round(scanProgress.value)}%`
            },
          },
          'scan',
        )
        .to(scanBarFill.current, { scaleX: 1, duration: 0.7, ease: 'power1.inOut' }, 'scan')

        // ---- phase 09: profile found (pause, dim, scanline, reveal) ----
        // A genuine still beat once the bar completes — nothing moves for
        // ~250ms before the interface reacts, so PROFILE FOUND reads as a
        // real discovery moment instead of the scan sliding straight into
        // the reveal.
        .addLabel('confirm', 'scan+=0.95')
        .to('.scan-panel__label, .scan-panel__list', { opacity: 0.35, duration: 0.12 }, 'confirm')
        .to(scanline.current, { opacity: 1, top: '100%', duration: 0.32, ease: 'power1.inOut' }, 'confirm+=0.05')
        .to(scanline.current, { opacity: 0, duration: 0.1 }, 'confirm+=0.35')
        .addLabel('found', 'confirm+=0.4')
        .to(panelScanning.current, { opacity: 0, duration: 0.15 }, 'found')
        .to(panelFound.current, { opacity: 1, duration: 0.2 }, 'found+=0.06')
        .fromTo(
          '.scan-panel__label--accent',
          { scale: 1 },
          { scale: 1.06, duration: 0.14, ease: 'power1.out', yoyo: true, repeat: 1 },
          'found+=0.1',
        )

        // ---- phase 10: profile reconstruction ----
        .addLabel('reconstruct', 'found+=0.3')
        .to(
          '.scan-panel__letter',
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out',
            stagger: { each: 0.018, from: 'random' },
          },
          'reconstruct',
        )
        .call(() => setStatus(''), undefined, 'reconstruct')

        // ---- phase 11: access granted ----
        .addLabel('access', 'reconstruct+=0.65')
        .to(panelFound.current, { opacity: 0, duration: 0.15 }, 'access')
        .to(panelAccess.current, { opacity: 1, duration: 0.2 }, 'access+=0.06')

        // ---- phase 12: the climax — everything converges into one node ----
        .addLabel('collapse', 'access+=0.35')
        .set(statusRef.current, { opacity: 1 }, 'collapse')
        .call(() => setStatus('Opening profile…'), undefined, 'collapse')
        // The button's label text is still in the DOM at this point (e.g.
        // "Initializing") — without this it gets scaled up 46x along with
        // the node in the expand tween below, producing giant stray brass
        // letter fragments over the revealed Hero.
        .to('.preloader__enter-label', { opacity: 0, duration: 0.15 }, 'collapse')
        .to(
          globeRoot.current,
          { x: -40, y: -10, scale: 0.3, opacity: 0, duration: 0.38, ease: 'power2.in' },
          'collapse',
        )
        .to(
          panelRoot.current,
          isMobile
            ? { y: -60, scale: 0.4, opacity: 0, duration: 0.38, ease: 'power2.in' }
            : { x: -60, scale: 0.4, opacity: 0, duration: 0.38, ease: 'power2.in' },
          'collapse',
        )
        .to(statusRef.current, { opacity: 0, scale: 0.85, duration: 0.3, ease: 'power1.in' }, 'collapse+=0.05')
        .to('[data-preloader-meta]', { opacity: 0, y: -10, duration: 0.28 }, 'collapse')
        .addLabel('pulse', 'collapse+=0.36')
        .to(
          enterRef.current,
          {
            opacity: 1,
            scale: 1.15,
            duration: 0.14,
            ease: 'power2.out',
            boxShadow: '0 0 0 1px var(--color-accent), 0 0 40px 8px var(--color-accent-soft)',
          },
          'pulse',
        )
        .addLabel('expand', 'pulse+=0.14')
        .to(enterRef.current, { scale: 46, opacity: 0, duration: 0.62, ease: 'power2.in' }, 'expand')
        .to(
          backdropRef.current,
          { clipPath: 'circle(0% at 50% 50%)', duration: 0.6, ease: 'power2.inOut' },
          'expand+=0.05',
        )
        .call(() => window.dispatchEvent(new Event('app:entered')), undefined, 'expand+=0.12')
    }, rootRef)

    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSequence])

  const handleEnter = () => {
    if (isExiting) return
    setIsExiting(true)

    if (reducedMotion) {
      window.dispatchEvent(new Event('app:entered'))
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power1.out',
        onComplete: () => setIsGone(true),
      })
      return
    }

    // Decided once, here, at activation — see the comment on showSequence's
    // declaration for why this must not be re-derived from live
    // reducedMotion state later.
    setShowSequence(true)
  }

  if (isGone) return null

  return (
    <div className={`preloader${isExiting ? ' is-exiting' : ''}`} ref={rootRef}>
      <div className="preloader__backdrop" ref={backdropRef} aria-hidden="true" />

      <div className="preloader__content">
        <span className="preloader__ready" data-preloader-meta>
          Ready
        </span>

        <div className="preloader__bottom-row">
          <div className="preloader__corner preloader__corner--identity" data-preloader-meta>
            <span>{links.name}</span>
            <span>Software Engineer</span>
          </div>

          <div className="preloader__corner preloader__corner--overview" data-preloader-meta>
            <span>Overview:</span>
            <span>{PROJECT_COUNT} Projects</span>
          </div>

          <div className="preloader__corner preloader__corner--version" data-preloader-meta>
            <span>V-001</span>
            <span>{new Date().getFullYear()}</span>
          </div>
        </div>

        <span className="preloader__status" ref={statusRef} aria-hidden="true" />

        {showSequence && (
          <>
            <PreloaderRobot
              refs={{
                root: robotRoot,
                head: robotHead,
                eye: robotEye,
                upperArm: robotUpperArm,
                forearm: robotForearm,
                legL: robotLegL,
                legR: robotLegR,
              }}
            />
            <span className="preloader__connect-line" ref={connectLineRef} aria-hidden="true" />
            <span className="preloader__ring" ref={ringARef} aria-hidden="true" />
            <span className="preloader__ring preloader__ring--b" ref={ringBRef} aria-hidden="true" />
            <div className="preloader__particles" ref={particlesRef} aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span className="preloader__particle" key={i} />
              ))}
            </div>

            <PreloaderGlobe
              refs={{ root: globeRoot, rings: globeRings, wireframe: globeWireframe, spin: globeSpin, pulse: globePulse }}
            />
            <PreloaderScanPanel
              refs={{
                root: panelRoot,
                scanning: panelScanning,
                found: panelFound,
                access: panelAccess,
                scanBarFill,
                scanPercent,
                scanline,
              }}
            />
            <span className="preloader__packet" ref={packetRef} aria-hidden="true" />
          </>
        )}

        <MagneticWrapper strength={0.25} className="preloader__enter-wrapper">
          <button
            type="button"
            className="preloader__enter"
            ref={enterRef}
            onClick={handleEnter}
            disabled={isExiting}
            data-cursor="hover"
            aria-label="Enter the site"
          >
            <span className="preloader__enter-label">Enter</span>
            <span className="preloader__enter-label preloader__enter-label--hover" aria-hidden="true">
              Initialize
            </span>
            <span className="preloader__enter-label preloader__enter-label--active" aria-hidden="true">
              Activated
            </span>
          </button>
        </MagneticWrapper>
      </div>
    </div>
  )
}
