// Numbered section label. The number sits in a red block with black type (5.7:1), never as red text on white.
export function SectionLabel({ n, children }: { n: string; children: string }) {
  return <p className="section-label"><span className="section-index">{n}</span><span>{children}</span></p>
}
