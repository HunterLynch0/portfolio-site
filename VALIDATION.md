# Validation — 11 September 2026

## Automated checks

- Production build: passed without bundle warnings; React + Vite output generated in `dist/`.
- ESLint: passed.
- Node tests: thirteen passed, covering module identities/destinations, unified numbering, geometry and draw budgets, open cage windows, core routing, spring convergence, drag limits and touch intent, same-frame timing, unavailable WebGL, blocked context creation, timer cadence/cycling, interaction priority, inactive delivery, cleanup and the ambient core cycle.
- Dependency audit: zero vulnerabilities after compatible development dependency patches.
- Local production HTTP checks: page, résumé, favicon and all five project images returned 200. The résumé also passed a PDF signature check.

## Browser checks

Checked the actual app in the Codex browser, including the compiled production output.

- Responsive viewports: 1440 × 900, 768 × 1024, 390 × 844 and 320 × 740.
- No horizontal page overflow or broken images at the checked sizes.
- All six hero numbers match their actual page destination labels. Projects and toolkit rows share the same hierarchical numbering.
- About is selected as **01 / About** on initial load on desktop and mobile, with its preview, active label and mobile pressed state.
- All six module names remain visible at rest and during selection. Bounds-based positioning places them outside the module surfaces and clamps them within the stage. No label-to-label overlap in any of the six selected states at 1440px and 320px.
- Numerals and labels share the site’s Manrope family, weight and proportional tracking; numerals use tabular lining figures.
- The core diameter is 12.5% smaller than the preceding open-cage version. Wider windows and thinner members, a small nucleus and one fine orbit ring replace the overlapping internal/outer rings. Six routing contacts remain. All surrounding modules remain visually distinct in the checked compositions.
- Native pointer dragging changes orientation without navigation. Simulated touch checks pass for horizontal rotation, vertical gesture handling, cancellation, click suppression, limits and selection routing.
- Reduced-motion dragging responds directly without inertia or a traveling pulse.
- Selection gently reorients the assembly, emphasizes its rails and sends a finite white signal outward along the connection.
- Geometry hover changes the preview and lifts the selected component. Connections follow the component; labels move while hit targets stay stable.
- Keyboard focus updates the module preview. Native links navigate to existing section IDs, including IssueFlow and the backend/database skill rows.
- Mobile selectors update their pressed state and preview. The separate preview action navigates to the section; Contact and Databases were exercised.
- Project details open for all three projects. IssueFlow gallery selection updates the image and selected state.
- Native dialog focus stays inside the modal. Escape closes it, restores the opener's focus and releases body scroll.
- Packet visibility refinement: 20% longer, 10% wider, full peak opacity and white unaffected by tone mapping. Wire materials, travel time and pulse frequency remain unchanged.
- Automatic white packets cycle through the six existing rails at varied 3.4–5.5-second intervals. Passive packets preserve About selection and orientation; interaction redirects the reused packet immediately.
- Pause/resume updates its accessible state. Full pulse lifecycle fixture passes: no additional draw calls or new packets during 5.8-second paused, simulated hidden and offscreen windows; pulses resume onscreen.
- Simulated reduced-motion preference: zero packets and zero additional GPU draw calls over six seconds after initial rendering; all six labels remain visible.
- Ambient core: approximately 1.47°/second cage rotation; 4.4-second breathing cycle between 100% and 107.2%, with a small matching emissive lift. Surrounding assembly and label positions stay stable. Pausing freezes both core transforms and stops rendering.
- Simulated unavailable WebGL: visible static fallback, six native module links, no canvas and no crash; featured project navigation verified.
- No new browser warnings or errors during the final checks.
- All internal anchor destinations exist. Mobile includes selected work, résumé and GitHub links.

## Assets and performance

IssueFlow uses four replacement screenshots supplied on 11 September: product overview, repository workspace, issue details/discussion and sign-in. The corrected primary screenshot is 2582 × 1710 pixels. The main preview is black and white at rest and reveals its blue accents on hover or keyboard focus; the gallery contains the complete images and gives the portrait sign-in screen extra height on mobile. All four gallery controls and image loads were verified at desktop and mobile sizes without horizontal overflow. VersionHandle now uses four supplied terminal screenshots (command overview, first commit, history, and branches/merging), encoded as full-resolution JPEGs totaling 1,538,499 bytes. Its preview is monochrome until hover or keyboard focus, and its gallery preserves each full screenshot. ANDIE retains its WebP image; `Resume.pdf` is preserved.

The initial JavaScript is approximately 67 KB gzip. The lazy scene controller/geometry is approximately 9 KB gzip, with Three.js split into core (61 KB gzip) and renderer (85 KB gzip) chunks. The page uses a locally served 25 KB variable font.

The settled desktop scene renders 19,148 triangles in 41 draw calls; mobile uses 17,420 triangles. A traveling pulse adds one draw call and 32 triangles. A three-second active pointer trace at 1440 × 900 observed approximately 121 animation frames per second on this machine, with the longest interval measuring 9 ms. This is a local browser measurement, not a physical-phone benchmark or a guarantee for other hardware.

Rendering uses capped device pixel ratios, simpler mobile geometry, merged meshes, instanced routing contacts, no post-processing and a studio environment generated once at startup. Rendering continues while the ambient core is visible and motion is enabled. The ambient clock, cancellable timer and packets stop while offscreen, hidden, paused or reduced motion is enabled. The timer is disposed on unmount; context loss also suspends it. Reusable vectors and spring output avoid added animation scratch allocations.

## External links

IssueFlow, the GitHub profile and both GitHub repositories returned 200. LinkedIn rejects automated HEAD requests with 405, so its availability could not be confirmed that way; the exact profile URL supplied in the brief is retained.
