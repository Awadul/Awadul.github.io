export type MembranePointer = { x:number; y:number; active:boolean; impulse:number }

/** Fixed-step spring surface. All forces use the same previous-frame depth field. */
export class MembraneMesh {
 readonly columns:number
 readonly rows:number
 readonly x:Float32Array
 readonly y:Float32Array
 readonly dx:Float32Array
 readonly dy:Float32Array
 readonly z:Float32Array
 private vx:Float32Array
 private vy:Float32Array
 private vz:Float32Array
 private nextZ:Float32Array
 constructor(readonly width:number,readonly height:number,spacing=34) {
  this.columns=Math.max(3,Math.min(50,Math.ceil(width/spacing)+1))
  this.rows=Math.max(3,Math.min(30,Math.ceil(height/spacing)+1))
  const count=this.columns*this.rows
  this.x=new Float32Array(count);this.y=new Float32Array(count)
  this.dx=new Float32Array(count);this.dy=new Float32Array(count);this.z=new Float32Array(count)
  this.vx=new Float32Array(count);this.vy=new Float32Array(count);this.vz=new Float32Array(count);this.nextZ=new Float32Array(count)
  for(let row=0;row<this.rows;row++)for(let col=0;col<this.columns;col++){
   const i=row*this.columns+col
   this.x[i]=col*width/(this.columns-1);this.y[i]=row*height/(this.rows-1)
  }
 }
 step(time:number,pointer:MembranePointer) {
  for(let i=0;i<this.x.length;i++){
   const col=i%this.columns,row=Math.floor(i/this.columns)
   let coupling=0
   if(col>0)coupling+=this.z[i-1]-this.z[i]
   if(col<this.columns-1)coupling+=this.z[i+1]-this.z[i]
   if(row>0)coupling+=this.z[i-this.columns]-this.z[i]
   if(row<this.rows-1)coupling+=this.z[i+this.columns]-this.z[i]
   const breathe=Math.sin(time*.6+col*.15+row*.12)*1.5
   this.vx[i]-=this.dx[i]*.025;this.vy[i]-=this.dy[i]*.025
   this.vz[i]+=coupling*.18-this.z[i]*.0375+(breathe-this.z[i])*.002
   if(pointer.active){
    const px=this.x[i]-pointer.x,py=this.y[i]-pointer.y,distance=Math.hypot(px,py)
    const radius=pointer.impulse>0?200:130
    if(distance<radius){
     const falloff=(1-distance/radius)**2
     const force=falloff*(pointer.impulse>0?30:2.4)
     this.vx[i]+=px/Math.max(1,distance)*force*.12
     this.vy[i]+=py/Math.max(1,distance)*force*.12
     this.vz[i]+=force*.4
    }
   }
   this.vx[i]*=.93;this.vy[i]*=.93;this.vz[i]*=.93
   this.dx[i]=Math.max(-32,Math.min(32,this.dx[i]+this.vx[i]))
   this.dy[i]=Math.max(-32,Math.min(32,this.dy[i]+this.vy[i]))
   this.nextZ[i]=Math.max(-50,Math.min(50,this.z[i]+this.vz[i]))
  }
  this.z.set(this.nextZ)
 }
}
