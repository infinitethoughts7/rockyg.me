# Caira Visual Blog — Design Spec

Date: 2026-08-02
Status: Approved by Rocky G (placement, depth, playgrounds, and overall design confirmed in brainstorming session)

## Goal

A new page at `rockyg.me/caira` that tells the complete Caira story (the multi-tenant WhatsApp AI receptionist) the way `/Users/Apple/Desktop/caira/blog/clinicbot-deep-dive.html` looks, and teaches LLM concepts (harness, memory, guardrails, grounding/RAG, caching, fallback routing, queues, evals) the way `/Users/Apple/Claude/Projects/Rocky3.0/skills-deck.html` teaches them: interactive playgrounds and kid-level analogies.

Hard requirements from Rocky:

1. Readable end-to-end by a non-technical person.
2. Low text, high animation. Every section leads with a visual; prose is 2 to 4 sentences per section.
3. HLD and LLD architecture must be crystal clear, animated.
4. Funny in places, exciting to read. Jokes live in analogies, captions, and microcopy only, never inside factual or architectural claims.
5. No em dashes anywhere in reader-facing copy (Rocky's standing blog style rule). Use commas, periods, or colons instead.
6. No fabricated metrics. Numbers come from the deep-dive source (which reads them off the codebase): 21 modules, 24 ports, 43 adapters, 22 tables, roughly $0.0005 per grounded answer, 6.3s to 1.6s Flow fix. Modeled numbers keep their visible ESTIMATE label.

## Placement and site integration

- New standalone page: `rockyg.me/caira` (custom Astro page, outside the markdown blog pipeline).
- The existing post `src/data/blog/building-a-whatsapp-ai-receptionist-hospitals-can-trust.md` is trimmed to a short teaser (~40 lines): hook, one or two paragraphs, then a prominent "Take the animated tour" link to `/caira`. Frontmatter keeps `featured: true`; add `modDatetime`. This keeps Caira in the blog list, tags, RSS, and Pagefind search.
- The page carries its own `<title>` and meta description, and a small "← rockyg.me" home link. Sitemap picks it up automatically. v1 uses the site's default OG image.

## Architecture (Approach 2: page + components)

- `src/pages/caira/index.astro`: page shell. Design tokens and shared styles in `<style is:global>` scoped to a `.caira` root class; one vanilla `<script is:inline>` at the bottom holding all playground logic. Zero runtime dependencies, no framework islands, static-build friendly (GitHub Pages).
- `src/components/caira/*.astro`: one component per big visual so diagrams can be iterated on safely:
  - `TraceHero.astro`: WhatsApp chat + traced message with the looping runner dot.
  - `JourneyMap.astro`: the 9-step journey of one message, steps light up as the dot travels.
  - `SystemContextMap.astro`: HLD level 1 (humans left, system center, rented services right, animated edges).
  - `ContainerMap.astro`: HLD level 2 (edge / domain / state lanes, "three unlocked doors").
  - `TenancyLetterbox.astro`: animated letterbox routing (phone_number_id resolves the clinic; the visitor cannot lie).
  - `HarnessLoop.astro`: perceive → think → act → check loop orbiting a small LLM chip.
  - `GroundingPlayground.astro`: librarian scores facts, only winners reach the AI.
  - `GuardrailsPlayground.astro`: jailbreak textarea + bouncer shield + the three walls cards.
  - `MemoryPlayground.astro`: timetable vs report card; toggle makes "same doctor as last time" work.
  - `CachePlayground.astro`: ask twice (second hit: 0 ms, $0.00) plus the monthly-bill sliders.
  - `FallbackQueuePlayground.astro`: "kill Gemini" switch with keyword-bot catch, plus letterbox queue animation.
  - `EvalsPlayground.astro`: prompt v1 vs v2 over 5 patient questions, regression alarm blocks the bad deploy.
  - `StateMachine.astro`: conversation state machine, animated transitions.
  - `GroundingPipeline.astro`: conveyor belt: prompt → schema check → sanitizer → fallback; a bad reply is visibly rejected off the belt.
  - `LatencyBudget.astro`: per-hop latency bars.
  - `ScalingLadder.astro`: 1 → 10 → 100 → 1000 clinics rungs with "what breaks" notes.
  - `NerdBox.astro`: `<details>/<summary>` wrapper labeled "For engineers", used by any section that carries depth.

All diagrams are inline SVG animated with CSS (`.flow-dash`, `.pulse`, `@keyframes grow`), matching the deep-dive's technique. Playground logic is plain DOM scripting keyed by ids/data attributes.

## Visual language

Ported from the deep-dive: dark ink canvas (#090D12 family), teal = system/AI path, amber = cost/latency, WhatsApp green = chat, violet = plain-English/analogy track, red = failure/handoff. Fonts: Space Grotesk (display), Inter (body), JetBrains Mono (labels). Scroll progress bar, reveal-on-scroll via IntersectionObserver, radial background glows. The reading-mode toggle from the deep-dive is intentionally dropped; NerdBoxes replace it as the depth mechanism.

## Page structure (five acts, ~13 sections)

Hero: "One message, fully traced." Chat bubbles + trace spine with runner dot. Subtitle tone: "She never sleeps, never guesses, and never invents a consultation fee."

- Act 1, Meet Caira: (1) what she is, apartment-building multi-tenancy analogy; (2) JourneyMap of one message end to end.
- Act 2, HLD animated: (3) SystemContextMap; (4) ContainerMap, "a building with three unlocked doors"; (5) TenancyLetterbox, "trust the letterbox, not the visitor".
- Act 3, LLM concepts as playgrounds: (6) HarnessLoop, the loop is the product, the model is a part; (7) GroundingPlayground + GuardrailsPlayground, the three walls and the bouncer; (8) MemoryPlayground, state vs recall; (9) CachePlayground, stop paying for the same answer twice; (10) FallbackQueuePlayground, the product outlives the vendor; (11) EvalsPlayground, an exam before every deploy.
- Act 4, LLD visual: (12) StateMachine + GroundingPipeline conveyor.
- Act 5, Scale and punchline: (13) LatencyBudget + ScalingLadder + the reveal that the AI is not the expensive part, WhatsApp reminders are. Outro: "Everyone can build the demo. This is everything between the demo and a hospital trusting it," stats row, link back to the blog.

Each architecture section (3, 4, 5, 12, 13) includes a NerdBox with the real depth: port names, table counts, index list, state names, latency numbers.

## Error handling

Playgrounds are fully client-side with no network calls, so failure modes are limited: script guarded so a missing element no-ops instead of throwing; `prefers-reduced-motion` disables the runner, dashes, pulses, and reveals while leaving all content visible; page remains fully readable with JavaScript disabled (playground buttons simply do nothing; all explanatory copy is static HTML).

## Accessibility and responsive

Every SVG gets `role="img"` plus a descriptive `aria-label`. Color is never the only carrier (labels accompany color coding). `<details>` NerdBoxes are keyboard-native. Diagrams scale via `viewBox`; grids collapse to one column under 820px; target sanity check at 375px width.

## Testing and verification

1. `npm run lint` and `npm run build` pass (build includes `astro check` and Pagefind).
2. Browser walkthrough of every act on desktop: animations fire, all seven playgrounds respond, NerdBoxes open.
3. Mobile emulation (375px) and `prefers-reduced-motion` emulation.
4. Teaser post renders correctly in blog list and links to `/caira`.

## Out of scope

The deep-dive's full API reference (Part IV), config tables, the Plain/Full reading-mode toggle, backend or Caira-codebase changes, a dedicated OG image for `/caira` (later polish), and fixing the unrelated broken images in `talent-access-ai.md` (tracked separately).
