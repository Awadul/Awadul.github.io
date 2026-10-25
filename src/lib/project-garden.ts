const clamp = (value: number) => Math.max(0, Math.min(1, value))

export function projectGardenState(distance: number, viewportHeight: number, count: number) {
 const step = Math.max(0, distance) / Math.max(1, viewportHeight)
 const index = Math.max(0, Math.min(Math.max(0, count - 1), Math.floor(step) - 1))
 const reveal = index === 0 ? clamp((step - .25) / .75) : clamp((step - index - 1) / .45)
 const exit = index < count - 1 ? clamp((step - index - 1.7) / .3) : 0
 return { index, reveal, exit }
}

export function samplePetal(index: number, progress: number, width: number, height: number) {
 const offset = (index * .61803398875) % 1
 const phase = ((progress * 3 + offset) % 1 + 1) % 1
 const angle = phase * Math.PI * 2.4 + index * 2.399963
 const radius = width * (.07 + .26 * Math.sin(phase * Math.PI))
 return {
  x:width * .5 + Math.sin(angle) * radius,
  y:height * (1.08 - phase * 1.12),
  rotation:angle + index * .41,
  size:(2.4 + ((index * 13) % 17) / 4) * Math.min(1, width / 700),
  opacity:Math.sin(phase * Math.PI) * (.18 + (index % 4) * .055),
  light:index % 3 === 0,
 }
}
