import './GrainBackground.css'

const NOISE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
  <filter id='n'>
    <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' />
    <feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.06 0' />
  </filter>
  <rect width='100%' height='100%' filter='url(#n)' />
</svg>`

const NOISE_URL = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`

/**
 * Fixed, layered, cursor-reactive background: a faint technical grid with a
 * slow ambient drift, a soft glow that follows the pointer via CSS vars set
 * in useMousePosition, and a static film-grain texture. Everything here is
 * `pointer-events: none` and sits behind the content layer.
 */
export function GrainBackground() {
  return (
    <div className="grain-background" aria-hidden="true">
      <div className="grain-background__glow" />
      <div className="grain-background__grid" />
      <div className="grain-background__noise" style={{ backgroundImage: NOISE_URL }} />
    </div>
  )
}
