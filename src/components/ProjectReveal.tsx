import { useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { keyVideoBlack } from '../lib/project-video-key'
import revealVideo from '../assets/videos/Video Project 1 (3).mp4'

interface Props { onComplete: () => void; onReveal?: () => void }

// Playback is real time: scrolling triggers the film, rather than scrubbing it.
export function ProjectReveal({ onComplete, onReveal }: Props) {
 const host = useRef<HTMLDivElement>(null)
 const video = useRef<HTMLVideoElement>(null)
 const trigger = useRef<HTMLDivElement>(null)
 const canvas = useRef<HTMLCanvasElement>(null)
 useLayoutEffect(() => {
  const node = video.current
  const element = trigger.current
  if (!node || !element) return
  if (!('IntersectionObserver' in window)) { onComplete(); return }
  const surface = canvas.current
  const context = surface?.getContext('2d', { willReadFrequently:true })
  if (!surface || !context) { onComplete(); return }
  let visible = false
  let disposed = false
  let handedOff = false
  let frameId = 0
  let lastTime = -1
  const nativeFrames = typeof node.requestVideoFrameCallback === 'function'
  const stopFrames = () => {
   if (frameId) {
    if (nativeFrames) node.cancelVideoFrameCallback(frameId)
    else cancelAnimationFrame(frameId)
   }
   frameId = 0
  }
  const paint = () => {
   frameId = 0
   if (disposed || node.paused || !visible || document.hidden) return
   if (node.readyState >= 2 && node.videoWidth && node.currentTime !== lastTime) {
    try {
     if (surface.width !== node.videoWidth || surface.height !== node.videoHeight) {
      surface.width = node.videoWidth
      surface.height = node.videoHeight
     }
     context.drawImage(node, 0, 0, surface.width, surface.height)
     const frame = context.getImageData(0, 0, surface.width, surface.height)
     keyVideoBlack(frame.data)
     context.putImageData(frame, 0, 0)
     lastTime = node.currentTime
     if (host.current) host.current.dataset.active = 'true'
    } catch { finish(); return }
   }
   frameId = nativeFrames ? node.requestVideoFrameCallback(paint) : requestAnimationFrame(paint)
  }
  const startFrames = () => { stopFrames(); paint() }
  let timeout: ReturnType<typeof setTimeout> | undefined
  const clearWatchdog = () => { if (timeout) clearTimeout(timeout) }
  const finish = () => { if (!disposed) onComplete() }
  const guard = () => {
   clearWatchdog()
   if (visible && !document.hidden) timeout = setTimeout(finish, 8000)
  }
  const progress = () => {
   guard()
   if (!handedOff && Number.isFinite(node.duration) && node.duration > 0 && node.currentTime >= node.duration - .75) {
    handedOff = true
    if (host.current) host.current.dataset.leaving = 'true'
    onReveal?.()
   }
  }
  const sync = () => {
   if (!visible || document.hidden) { stopFrames(); node.pause(); clearWatchdog(); return }
   // Muted inline playback works with mobile autoplay policies. If refused,
   // expose the work immediately instead of trapping visitors on a poster.
   node.muted = true
   guard()
   node.play().then(startFrames).catch(() => { if (!disposed && visible && !document.hidden) finish() })
  }
  const observer = new IntersectionObserver(entries => {
   visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .45
   if (host.current) host.current.dataset.visible = String(visible)
   sync()
  }, { threshold:[0, .45] })
  node.addEventListener('timeupdate', progress)
  node.addEventListener('playing', startFrames)
  node.addEventListener('pause', stopFrames)
  document.addEventListener('visibilitychange', sync)
  observer.observe(element)
  return () => { disposed = true; stopFrames(); clearWatchdog(); observer.disconnect(); node.pause(); node.removeEventListener('timeupdate', progress); node.removeEventListener('playing', startFrames); node.removeEventListener('pause', stopFrames); document.removeEventListener('visibilitychange', sync) }
 }, [onComplete, onReveal])
 return <><div ref={trigger} className="project-reveal-trigger" aria-hidden="true"/>{createPortal(<div ref={host} className="project-video-reveal" data-visible="false">
  <video ref={video} src={revealVideo} muted playsInline preload="metadata" onEnded={onComplete} onError={onComplete} aria-hidden="true"/>
  <canvas ref={canvas} aria-hidden="true"/>
 </div>, document.body)}</>
}
