# Hunter Lynch — Portfolio

A React + Vite portfolio with a warm monochrome palette, editorial project layouts and an interactive Three.js technical system.

## Run

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npm run lint
npm test
npm run build
npm run preview
```

The production output is `dist/`. Deploy it as a static site. The existing résumé is served at `/Resume.pdf`.

## Structure

- `src/App.jsx`: page shell, navigation and hero.
- `src/components/PortfolioSystem.jsx`: semantic module links, information preview, touch selection and scene lifecycle.
- `src/scene/systemGeometry.js`: six connected components, merged meshes, instanced contacts and spring motion.
- `src/scene/coreGeometry.js`: open hexagonal containment cage, small inner nucleus and one fine orbit ring.
- `src/scene/pulseScheduler.js`: one cancellable timer for varied, recurring packets and interaction priority.
- `src/scene/systemInteraction.js`: constrained rotation, drag intent, resistance and frame timing.
- `src/scene/portfolioSystem.js`: studio lighting, camera, raycasting, reactive rails, scroll response and demand rendering.
- `src/components/`: about, editorial work, native project dialog, toolkit and contact.
- `src/data/sections.js`: shared page numbering; project and toolkit children derive their identifiers from their parent section.
- `src/data/system.js`: six module identities, previews, destinations and spatial arrangement.
- `src/data/portfolio.js`: projects, galleries, technologies and external links.
- `src/index.css`: typography, responsive layout and motion styles.
- `public/images/`: current IssueFlow PNG screenshots, four VersionHandle JPEG screenshots and the ANDIE WebP preview.

## Interaction and accessibility

The signature core is an open graphite hexagonal cage around a small, softly lit nucleus. The 30 hexagonal and 12 pentagonal windows are actual holes in the geometry. The cage and orbit diameter are reduced by 12.5% from the preceding open-cage version, without changing the module arrangement. Cage members are thinner, with wider windows; the internal ring and second outer ring are removed. About is selected on the first render, including the preview, raised module and a gentle orientation toward it.

Pointer dragging rotates the assembly within approximately ±41° horizontally and ±8° vertically. Resistance increases near the limits, motion eases toward the released position, and selection gently blends the retained position toward the selected module. Horizontal touch gestures rotate; vertical gestures retain native scrolling and pinch zoom. Pointer cancellation and blur clean up the gesture, and a drag cannot accidentally follow a module link. Passive parallax is local, small and heavily eased.

Hovering or focusing a module lifts it, flexes and emphasizes its paired rails, and reveals one concise preview. Its cage sector opens slightly, the single orbit ring tilts, and a white signal travels outward along the actual curved connection over 1.1 seconds before fading. The packet is 20% longer and 10% wider, with an untonemapped white material and full peak opacity for a small contrast lift. A passive packet cycles through the six existing connections every 3.4–5.5 seconds without changing selection or orientation. Interaction takes priority, restarting the same packet toward its chosen module. The small core brightens barely during departure. Independently, the hex cage turns once every approximately 244 seconds and the white nucleus breathes from 100% to 107.2% scale over a 4.4-second cosine-eased cycle, with a small emissive lift. Scroll adds a small change in orientation and spacing. All six native links retain direct navigation to the corresponding content.

Section numbers are shared across the page and hero: About **01**, Selected Work **02**, Toolkit **03**, Contact **04**. Projects use **02.1–02.3**; toolkit rows use **03.1–03.4**. The hero references the precise destination: IssueFlow **02.1**, Backend **03.1**, Databases **03.4**. DOM order, keyboard order, mobile controls and previews use this same hierarchy. Every name stays visible in grey, darkening on hover or selection. Labels sit above or below the projected module bounds, remain within the stage, and follow moving components while their clickable targets remain stable. Numerals use the same Manrope family, weight and tracking as the site metadata, with tabular lining figures and a fine selected underline.

On mobile, six numbered buttons and touch selection reveal the same information, with a separate preview link for navigation. Vertical page scrolling remains native. If WebGL is unavailable, the static orb and six native links remain usable.

Rendering continues gently for the core’s ambient motion while visible. The ambient clock, pulse timer and traveling packet stop when paused, offscreen, hidden or reduced motion is preferred; the frozen core resumes without catching up, and a fresh packet interval begins on resuming. The timer is cancelled on context loss and disposal. A single packet mesh and reusable vectors/spring output avoid per-frame geometry or scratch-vector allocation. Reduced motion still permits static selection and direct manual rotation, with no inertia, passive parallax or routing pulse. Geometry and pixel density are capped on mobile. Three.js loads separately from the initial page; studio lighting is generated once. No external environment textures or fonts are fetched at runtime.

Project previews open a native modal dialog. Escape dismisses it, focus returns to the opener, background content is inert, and IssueFlow has a keyboard-accessible screenshot gallery. Reduced-motion styles disable reveal and perspective effects. Project images reserve their dimensions and load lazily.

## Verification

Thirteen Node tests cover module identities, numbering against destinations, geometry and rendering budgets, raycasts through the open cage windows, routing poses and pulse settling, spring stability, rotation limits and touch intent, same-frame clock skew, unavailable WebGL, blocked context creation, varied pulse cadence, routing order, interaction priority, inactive delivery, timer disposal and the restrained ambient core cycle.

Development-only browser fixtures exercise the actual app:

- `/tests/browser.html?mode=reduced`: measures GPU draw calls after the initial static render.
- `/tests/browser.html?mode=idle`: verifies quiet rotation, the 7.2% breathing range, stable assembly/labels and zero rendering while paused.
- `/tests/browser.html?mode=no-webgl`: verifies the semantic module fallback.
- `/tests/browser.html?mode=gestures`: simulates touch/mouse gestures, cancellation, drag-click suppression, constrained poses and selection routing in the real app.
- `/tests/browser.html?mode=labels`: checks permanent visibility, viewport bounds and overlap across every selection.
- `/tests/browser.html?mode=pulses`: checks automatic routes/timing, stable selection, pause, simulated hidden document, offscreen sleep and resume.
- `/tests/browser.html?mode=performance`: runs a three-second pointer trace and reports observed frame cadence, draw calls and triangles.

Fixtures are excluded from the production build. See `VALIDATION.md` for measured results and browser checks.
