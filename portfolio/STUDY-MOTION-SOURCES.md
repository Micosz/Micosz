# University journey — motion and computer models

The About semester section follows the user's supplied motion reference:
https://templates-preview.oxvo.app/t/oxvo-original-studio-max-commerce-3d/latest/#/

The pinned stage, alternating copy, reversible scroll progression, large background year, chapter rail, pointer rotation and Reset remain. The existing portfolio header and transcript content stay in place.

## Computers through time

The user requested an old-to-modern computer sequence, ending in a MacBook. Four real GLB models now accompany the seven terms:

| Terms | Object | Artist | Source |
| --- | --- | --- | --- |
| 1–2 | CRT desktop / Simple computer | Robert Schlyter | https://poly.pizza/m/doMMnviJrGi |
| 3–4 | Desktop PC / Computer | Poly by Google | https://poly.pizza/m/2EHvZLax4Y3 |
| 5–6 | All-in-one / Monitor | Poly by Google | https://poly.pizza/m/0twMVGXRVDl |
| 7 | Laptop / MacBook Pro | Alex Safayan | https://poly.pizza/m/27hcX_w47Jb |

All four original source pages list **CC BY 3.0**: https://creativecommons.org/licenses/by/3.0/ . Public attribution is shown under **3D model credits** in the About page. Original metadata and full per-model credits are retained in `assets/study/computers/`.

Geometry is unchanged. Scale and orientation are normalized; lighting and transitions are adapted to the portfolio. Model downloads total 368,800 bytes. The local fallback PNGs are transparent renders of these exact models, not screenshots of the source website.

The eras are a visual progression. They do not assert computer release dates matching academic years or ownership of those devices. Academic records and captions remain sourced as documented in `ABOUT-SOURCES.md`.

## Implementation

- `study-computers.js`: source catalogue, normalization and term-to-era mapping.
- `study-object.js`: GLB loading, a shared Three.js renderer, lighting, whole-object crossfades and cleanup.
- `study-journey.js`: chapter state, scroll-controlled rotation/scale, keyboard and pointer controls.
- `study-journey.css`: scoped stage, responsive layout, object captions and attribution disclosure.
- `content.js` → `education.terms`: all academic text, dates and records, also editable in Edit portfolio.

Each era transition blends two separately rendered opaque objects. This prevents internal faces from showing through a translucent model. The blend is driven by the same scroll position as the chapter; reversing scroll reverses the transition. Off-screen render targets and model resources are disposed on route exit. The renderer is scheduled only by input, scroll and resize; it has no idle animation loop.

Assets and dependencies are local, without runtime CDN requests. WebGL failure displays the appropriate local poster for the selected era and hides unavailable rotation controls. Reduced motion and short landscape screens use direct chapter selection.

## Retained dependency credits

- Three.js 0.170.0, MIT: https://github.com/mrdoob/three/tree/r170 . Local module, GLTFLoader and BufferGeometryUtils in `assets/vendor/three/`; LICENSE retained. Imports changed to local paths.
- Phosphor rotation controls, MIT: matching SVG marks captured from the supplied reference, with light foreground fill. `assets/study/PHOSPHOR-LICENSE` retained.
- The previously used Classic Laptop by Arrangemonk / Poly Haven, CC0, remains in the local design workspace and is omitted from this published folder. https://polyhaven.com/a/classic_laptop ; https://polyhaven.com/license . The active scene does not request it.
