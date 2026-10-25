import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react'
import treeImage from '../assets/weeping-cherry-monochrome.webp'
import { samplePetal } from '../lib/project-garden'
import '../styles/project-tree.css'

export interface ProjectTreeHandle { draw: (progress: number) => void }

export const ProjectTree = forwardRef<ProjectTreeHandle>(function ProjectTree(_, ref) {
 const canvas = useRef<HTMLCanvasElement>(null)
 const progress = useRef(0)
 const paint = useRef<((value: number) => void) | null>(null)
 useImperativeHandle(ref, () => ({ draw(value) { progress.current = value; paint.current?.(value) } }), [])
 useLayoutEffect(() => {
  const node = canvas.current
  const context = node?.getContext('2d')
  if (!node || !context) return
  let width = 0
  let height = 0
  const draw = (value: number) => {
   context.clearRect(0, 0, width, height)
   const count = width < 600 ? 24 : 44
   for (let index = 0; index < count; index++) {
    const petal = samplePetal(index, value, width, height)
    context.save()
    context.translate(petal.x, petal.y)
    context.rotate(petal.rotation)
    context.globalAlpha = petal.opacity
    context.fillStyle = petal.light ? '#9a9a94' : '#555650'
    context.beginPath()
    context.moveTo(0, -petal.size)
    context.bezierCurveTo(petal.size, -petal.size * .5, petal.size * .7, petal.size, 0, petal.size)
    context.bezierCurveTo(-petal.size * .7, petal.size * .5, -petal.size, -petal.size * .5, 0, -petal.size)
    context.fill()
    context.restore()
   }
  }
  const resize = () => {
   width = node.clientWidth
   height = node.clientHeight
   const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
   node.width = Math.max(1, Math.round(width * ratio))
   node.height = Math.max(1, Math.round(height * ratio))
   context.setTransform(ratio, 0, 0, ratio, 0, 0)
   draw(progress.current)
  }
  paint.current = draw
  const observer = new ResizeObserver(resize)
  observer.observe(node)
  resize()
  return () => { paint.current = null; observer.disconnect(); context.clearRect(0, 0, width, height) }
 }, [])
 return <div className="project-tree" aria-hidden="true"><img src={treeImage} alt="" width={1536} height={1024} decoding="async"/><canvas ref={canvas}/></div>
})
