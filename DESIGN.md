# Awais Abdullah — Portrait & Clouds

The October 24 user-supplied Dribbble video and five screenshots replace the previous Swiss brief. This redesign adopts its framed white portrait-led hero, outline/solid name typography, soft cloud canvas, two-column work gallery, expanding service rows, dark experience panel and centered contact surface. Personal content is preserved: the reference designer’s name, employers, project names and nine-year claim are not used.

## Tokens and layout
Charcoal #242424; white #FFFFFF; soft surface #F8F8F7; gray #717171; line #DEDEDC; availability green #16B56B. Inter remains the single family, in 400–650 weights. White panels cap at 1160px and sit over a generated grayscale cloud photograph. Body side spacing is 5.2vw (20–80px), reducing to 12px on phones. Controls are small pills, large surfaces have subtle 4–5px corners. Thin separators and quiet shadows replace the old heavy rules and red blocks. Exact values live in tokens.css.

The desktop hero puts the name across the upper third and the cutout portrait centrally in front. Supporting copy is lower left; social controls lower right. Below 640px, the portrait remains prominent above the supporting introduction; social controls become icon links and navigation expands from a menu. Work filters operate on real project categories, returning 6/4/2 results for All/Client/Personal. Services are an accessible three-item accordion, defaulting to Web design & development. The experience area distinguishes freelance practice since 2025 from selected project work and documents no invented employment.

## Motion and interaction
GSAP provides an overlapping 1.2s hero entrance and restrained portrait/name parallax linked to native scroll. Filters animate only after a user changes a category. Opening a service animates its description and reveals a real project screenshot. Experience links carry a pointer-following project preview on precise pointers; touch and reduced-motion users get static links. Image and font loading, and service height changes, safely refresh scroll calculations. Reduced motion disables authored entrances, parallax and pointer previews. No scroll hijacking, automatic video embed or fake cursor.

## Asset provenance
src/assets/portrait-cutout.webp is a built-in ImageGen transparent extraction of the previously approved awais-editorial-portrait.png. This extraction may slightly smooth facial texture; it is not claimed to be pixel-identical masking. src/assets/clouds.webp is an original generated monochrome cloud background. All project screenshots and official technology logos remain existing source assets. See visual-assets.provenance.md for prompts.

## Preserved functionality
Project URLs, code links, contact links, NUST policy RAG evidence, technology marks, visitor history, enquiry review/consent, owner inbox and backend logic remain intact. App styles remain split by section. The original reference video is research material and is not embedded or represented as the user’s work.

## Chat assistant surface — selected dark reference
The October 24 user-selected chatbot screenshot overrides the previous white assistant treatment for this component. Use a dark charcoal conversation canvas, slim navigation with back/close and options, a compact assistant identity card, open central space, two bottom-aligned starter questions, and a narrow pill composer. History, contact and brief tools live in the options area. Use the real portrait and existing project content; do not import reference model names, follower counts or unsupported voice controls. Preserve the growing-eye reveal, one-second linear timing, delayed input focus, conversation history, recovery and enquiry consent. The portfolio outside the chat keeps its portrait-and-clouds design.

## Opening question sequence
The October 24 fullscreen reference moves the question rotation from the masthead into a black-and-white opening sequence. Four two-line questions rotate from oversized cropped type into a still reading position, accompanied by a quiet oversized question mark. Each beat lasts 2.3 seconds; the final upward wipe lasts .7 seconds. The hero entrance starts with the wipe. The masthead returns to the availability tag. A visible Skip intro control and Escape immediately enter the site. Reduced motion and direct section/inbox links bypass the intro; hidden tabs pause the timeline. Intro is shown on a fresh home-page load, with the underlying page inert until completion.
