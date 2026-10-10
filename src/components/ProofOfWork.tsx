import { Quote } from 'lucide-react'
import '../styles/proof-of-work.css'

// Illustrative layout copy. Replace only with approved, genuine feedback.
const reviews = [
  { service: 'AI & automation', quote: 'Complex tools, made simple. Everything feels focused on the next step.' },
  { service: 'Website development', quote: 'A clear story, a thoughtful layout, and an experience that is easy to follow.' },
  { service: 'Browser tools', quote: 'Simple controls. A practical purpose. Exactly the kind of everyday tool I appreciate.' },
  { service: 'Business applications', quote: 'The details feel considered, with the daily workflow at the center.' },
  { service: 'Web presence', quote: 'The offering is easy to understand from the first visit.' },
  { service: 'Interface development', quote: 'Clean, focused, and easy to explore — without getting in the way.' },
]

export function ProofOfWork() {
  return (
    <section className="proof-section" aria-labelledby="proof-heading">
      <div className="proof-container">
        <div className="proof-header">
          <h2 id="proof-heading">A few words about the work.</h2>
          {/* <p>Illustrative review drafts — not actual client feedback.</p> */}
        </div>
        <div className="proof-grid">
          {reviews.map((review) => (
            <article className="proof-card" key={review.service}>
              <Quote className="proof-quote" size={23} strokeWidth={1.5} aria-hidden="true" />
              <blockquote>{review.quote}</blockquote>
              <span className="proof-service">{review.service}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
