import myNext9to5Image from '../assets/Projects/mynext9to5.png'
import cargoExpressImage from '../assets/Projects/cargo-express-freight.png'
import pixalImage from '../assets/Projects/Pixal-craft.jpg'
import vanisherImage from '../assets/Projects/vanisher-showcase.png'
import travectioImage from '../assets/Projects/travectio-showcase.png'
import radwiImage from '../assets/Projects/radwi-website.jpg'

export const projects = [
  {
    id: 'ai-cv',
    title: 'MyNext9to5',
    shortDescription: 'Automated resume parsing and applicant scoring pipeline for client recruitment at scale.',
    longDescription: 'Recruiters need structured candidate information from unstructured resumes. This platform parses PDFs, extracts candidate data, and scores applicants against job criteria to support the review workflow.',
    tech: ['Next.js', 'OpenAI API', 'PostgreSQL', 'Supabase'],
    link: 'https://mynext9to5.com',
    github: null,
    image: myNext9to5Image
  },
  {
    id: 'cargo-crm',
    title: 'Cargo Express Freight CRM',
    shortDescription: 'Custom CRM for a freight and logistics company managing shipments and client operations.',
    longDescription: 'Freight teams need a shared view of shipment and customer information. This custom CRM brings shipment management and client operations into a web application built around the logistics workflow.',
    tech: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    link: 'https://cargoexpressfreight.com/',
    linkText: 'Client Website',
    github: null,
    image: cargoExpressImage
  },

  {
    id: 'radwi-platform',
    title: 'RADWI Corporate Platform',
    shortDescription: 'Corporate website redesign for an IoT hardware and engineering company.',
    longDescription: 'Engineering offerings need a clear client-facing presentation. The redesign work combines a reusable design system, responsive layouts, and scroll-triggered motion to present the company and its products.',
    tech: ['React.js', 'Tailwind CSS', 'Framer Motion'],
    link: 'https://rad-wi.com',
    github: 'https://github.com/Awadul/RADWI---Protype-Website-View',
    image: radwiImage
  },
  {
    id: 'pixal-craft', title: 'Pixal Craft',
    shortDescription: 'A creative web application with a focus on interface design.',
    longDescription: 'A public frontend project demonstrating React development and a polished visual interface. Explore the deployed application and source to see the implementation.',
    tech: ['React', 'JavaScript'], link: 'https://pixal-craft.vercel.app',
    github: 'https://github.com/Awadul/PixalCraft', image: pixalImage
  },
  {
    id: 'travectio', title: 'Travectio Solutions',
    shortDescription: 'A financial decision platform for transportation companies, bringing operating costs and projected profitability into focus.',
    longDescription: 'Travectio presents vehicle-specific operating costs, cost-per-mile analysis, and projected margins to support transportation decisions before work begins.',
    tech: ['Financial workflows', 'Transportation', 'Web platform'],
    link: 'https://travectiosolutions.com/', github: null, image: travectioImage
  },
  {
    id: 'vanisher', title: 'Vanisher Chrome Extension',
    shortDescription: 'Schedule browser-data cleanup or clear selected data on demand, entirely on your device.',
    longDescription: 'An open-source Manifest V3 extension using Chrome alarms, browsingData, and local storage for scheduled cleanup and persistent preferences.',
    tech: ['JavaScript', 'Manifest V3', 'Chrome APIs'],
    link: 'https://chromewebstore.google.com/detail/vanisher-auto-delete-brow/bebdehdpolcbjpbbcgmcfalppgbfhind?authuser=0&hl=en',
    linkText: 'Chrome Web Store',
    github: 'https://github.com/Awadul/Vanisher-Extension', image: vanisherImage
  },


]

