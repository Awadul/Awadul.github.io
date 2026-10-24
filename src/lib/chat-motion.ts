/** A solid eye expands from the center; only the outer frontier carries spiral cuts. */
export function chatSpiralClip(progress:number,width:number,height:number):string {
 const amount=Math.max(0,Math.min(1,progress))
 if(amount>=1)return 'none'
 if(amount<=0)return 'path("M0 0Z")'
 const radius=Math.hypot(width,height)/2+2
 const armCount=5
 const steps=128
 const rimSteps=24
 // The solid eye grows linearly; its outer quarter carries the spiral frontier.
 const reach=amount/.75
 const front=reach
 // Widening outruns rotation, so revealed content remains visible during opening.
 const rotation=Math.log1p(amount*10)
 const point=(r:number,angle:number)=>`${(width/2+Math.cos(angle)*r).toFixed(2)} ${(height/2+Math.sin(angle)*r).toFixed(2)}`
 const spread=(r:number)=>Math.PI/armCount*Math.min(1,Math.max(0,(1-r/front)/.25))
 const arms=Array.from({length:armCount},(_,arm)=>{
  const base=arm*Math.PI*2/armCount+rotation
  const angle=(r:number)=>base+(1-r)*Math.PI*4
  const edge=(step:number,side:number)=>{
   const r=front*step/steps
   return point(radius*r,angle(r)+side*spread(r))
  }
  const outward=Array.from({length:steps+1},(_,step)=>`${step?'L':'M'}${edge(step,-1)}`).join(' ')
  const rim=Array.from({length:rimSteps},(_,step)=>`L${point(radius*front,angle(front)-spread(front)+2*spread(front)*(step+1)/rimSteps)}`).join(' ')
  const inward=Array.from({length:steps+1},(_,step)=>`L${edge(steps-step,1)}`).join(' ')
  return `${outward} ${rim} ${inward} Z`
 }).join(' ')
 return `path("${arms}")`
}