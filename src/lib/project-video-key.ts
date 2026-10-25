// Key the flattened black backing into actual per-pixel canvas transparency.
// Only the soft edge band needs color decontamination; solid foreground stays intact.
export function keyVideoBlack(pixels: Uint8ClampedArray) {
 for (let i = 0; i < pixels.length; i += 4) {
  const signal = Math.max(pixels[i], pixels[i + 1], pixels[i + 2])
  if (signal <= 10) { pixels[i + 3] = 0; continue }
  if (signal >= 44) continue
  const edge = (signal - 10) / 34
  const alpha = edge * edge * (3 - 2 * edge)
  pixels[i] = Math.min(255, pixels[i] / alpha)
  pixels[i + 1] = Math.min(255, pixels[i + 1] / alpha)
  pixels[i + 2] = Math.min(255, pixels[i + 2] / alpha)
  pixels[i + 3] = Math.round(pixels[i + 3] * alpha)
 }
}
