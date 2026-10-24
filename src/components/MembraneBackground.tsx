import { useEffect, useRef } from 'react'
import { MembraneMesh, type MembranePointer } from '../lib/membrane'
import '../styles/membrane.css'

type QuietZone={left:number;top:number;right:number;bottom:number}

export function MembraneBackground({page=false}:{page?:boolean}) {
 const canvas=useRef<HTMLCanvasElement>(null)
 useEffect(()=>{
  const node=canvas.current
  if(!node)return
  const host=page?document.documentElement:node.parentElement
  if(!host)return
  const context=node.getContext('2d',{alpha:true})
  if(!context)return
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)')
  const coarse=window.matchMedia('(pointer: coarse)')
  const pointer:MembranePointer={x:0,y:0,active:false,impulse:0}
  let mesh:MembraneMesh,frame=0,previous=0,accumulator=0,time=0,visible=true,disposed=false
  let bounds=node.getBoundingClientRect(),zones:QuietZone[]=[]
  const refreshZones=()=>{
   bounds=node.getBoundingClientRect()
   zones=page?[]:Array.from(host.querySelectorAll('.hero-name,.hero-introduction,.hero-socials')).map(element=>{
    const rect=element.getBoundingClientRect()
    return {left:rect.left-bounds.left-24,top:rect.top-bounds.top-18,right:rect.right-bounds.left+24,bottom:rect.bottom-bounds.top+18}
   })
  }
  const paint=()=>{
   if(!mesh)return
   const {width,height,columns,rows,x,y,dx,dy,z}=mesh
   context.clearRect(0,0,width,height)
   const sx=(i:number)=>x[i]+dx[i],sy=(i:number)=>y[i]+dy[i]-z[i]*.3
   context.lineWidth=.5
   context.strokeStyle=page?'rgba(36,36,36,0.035)':'rgba(36,36,36,0.025)'
   context.beginPath()
   for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
    const i=row*columns+col
    if(col<columns-1){context.moveTo(sx(i),sy(i));context.lineTo(sx(i+1),sy(i+1))}
    if(row<rows-1){context.moveTo(sx(i),sy(i));context.lineTo(sx(i+columns),sy(i+columns))}
   }
   context.stroke()
   for(let i=0;i<x.length;i++){
    const displacement=Math.hypot(dx[i],dy[i],z[i]*.3)
    const center=Math.max(0,1-Math.hypot(x[i]-width/2,y[i]-height/2)/Math.hypot(width/2,height/2)*1.4)
    const dim=zones.some(zone=>x[i]>zone.left&&x[i]<zone.right&&y[i]>zone.top&&y[i]<zone.bottom)?.15:1
    const alpha=Math.min(.32,.075+center*.07+displacement*.012)*dim
    context.fillStyle=`rgba(36,36,36,${alpha})`
    context.beginPath();context.arc(sx(i),sy(i),.7+Math.min(1,displacement*.035),0,Math.PI*2);context.fill()
   }
   // Keep the reading zones calm, including the connecting lines.
   for(const zone of zones)context.clearRect(zone.left,zone.top,zone.right-zone.left,zone.bottom-zone.top)
  }
  const tick=(now:number)=>{
   frame=0
   if(disposed||document.hidden||!visible||motion.matches||coarse.matches)return
   accumulator+=Math.min(50,previous?now-previous:16.67);previous=now
   while(accumulator>=1000/60){time+=1/60;mesh.step(time,pointer);pointer.impulse=0;accumulator-=1000/60}
   paint();frame=requestAnimationFrame(tick)
  }
  const sync=()=>{
   cancelAnimationFrame(frame);frame=0;previous=0;accumulator=0
   if(motion.matches||coarse.matches){pointer.active=false;context.clearRect(0,0,node.width,node.height);return}
   if(!document.hidden&&visible&&!disposed)frame=requestAnimationFrame(tick)
  }
  const resize=()=>{
   refreshZones()
   const width=Math.max(1,bounds.width),height=Math.max(1,bounds.height)
   const dpr=Math.min(window.devicePixelRatio||1,1.5)
   node.width=Math.round(width*dpr);node.height=Math.round(height*dpr)
   context.setTransform(dpr,0,0,dpr,0,0)
   mesh=new MembraneMesh(width,height,page?46:34)
   pointer.active=false;sync()
  }
  const move=(event:PointerEvent)=>{
   if(event.pointerType!=='mouse'||motion.matches||coarse.matches)return
   pointer.x=event.clientX-bounds.left;pointer.y=event.clientY-bounds.top
   pointer.active=pointer.x>=0&&pointer.y>=0&&pointer.x<=bounds.width&&pointer.y<=bounds.height
   if(page&&event.target instanceof Element&&event.target.closest('.panel,.hero-shell,.chat-widget'))pointer.active=false
  }
  const leave=()=>{pointer.active=false;pointer.impulse=0}
  const press=(event:PointerEvent)=>{
   if(event.button!==0||!(event.target instanceof Element)||event.target.closest('a,button,input,textarea,select,nav,h1,h2,h3,p,.hero-portrait'))return
   move(event);if(pointer.active)pointer.impulse=1
  }
  const scroll=()=>{leave();refreshZones()}
  const observer=new ResizeObserver(resize)
  observer.observe(node)
  const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;sync()})
  if(!page)intersection.observe(node)
  window.addEventListener('pointermove',move,{passive:true})
  window.addEventListener('pointerdown',press,{passive:true})
  window.addEventListener('blur',leave)
  document.documentElement.addEventListener('pointerleave',leave)
  window.addEventListener('scroll',scroll,{passive:true})
  document.addEventListener('visibilitychange',sync)
  motion.addEventListener('change',sync);coarse.addEventListener('change',sync)
  resize()
  return()=>{
   disposed=true;cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect()
   window.removeEventListener('pointermove',move);window.removeEventListener('pointerdown',press)
   window.removeEventListener('blur',leave);document.documentElement.removeEventListener('pointerleave',leave)
   window.removeEventListener('scroll',scroll);document.removeEventListener('visibilitychange',sync)
   motion.removeEventListener('change',sync);coarse.removeEventListener('change',sync)
  }
 },[page])
 return <canvas ref={canvas} aria-hidden="true" className={`membrane-background pointer-events-none ${page?'membrane-page':'membrane-hero'}`}/>
}
