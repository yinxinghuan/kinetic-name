# Reusable effect capture

## Capability

- Working name: shader-texture carousel.
- One-sentence visual result: render bitmap text into per-object targets and map them through distinct animated shaders on a rotating 3D ring.
- Reuse verdict: candidate; it requires live mobile parity QA before promotion.
- Example game: Kinetic Name.

## Upstream

- Work: Kinetic Typography with Three.js.
- Author: Mario Carrillo / Codrops.
- Demo: https://tympanus.net/Tutorials/codrops-kinetic-typo/
- Source: https://github.com/marioecg/codrops-kinetic-typo.
- Revision: `f381fb2b4aec7b6f9cc35b252bf8f911a51bf09c`.
- License: MIT; retain its complete notice and source attribution.

## Rendering recipe

- Engine: Three.js, bitmap font geometry, offscreen WebGL render targets.
- Geometry/data: four meshes around a radius-50 ring; each receives a text target.
- Stages: MSDF text render → render target → per-composition ShaderMaterial.
- Camera: PerspectiveCamera 45°, z=1; no post-processing.
- Defining constants: 4 forms, quarter-turn positions, 1.05s transition.

## Interaction hooks

- Primary pointer input: pointer-down locks the next form.
- Secondary input: post-completion single-finger horizontal drag rotates the ring.
- Safe parameters: word, object order, ring radius, transition duration.
- Avoid: changing shaders or substituting generic particles when claiming visual parity.

## Performance envelope

- Mobile: pixel ratio capped at 1.5.
- Offscreen: RAF clock is stopped while document is hidden.
- Fallback: no-WebGL browser requires an explicit DOM error state before promotion.

## Skill boundary

- Include: MSDF-to-render-target texture mapping and touch carousel lifecycle.
- Keep game-specific: four-lock progression, copy, and UI.
- Suggested skill name: `kinetic-texture-carousel`.
