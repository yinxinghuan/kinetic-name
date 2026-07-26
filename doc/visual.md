# Visual Direction

## Thesis

An intimate kinetic sculpture that turns the player's name into four materially different states: white knot, blue sphere, magenta twisted block, and pale relief plane.

## Composition / Camera

The original 45-degree perspective camera sits at z=1 and observes four objects on a radius-50 carousel. Full-bleed WebGL fills the viewport; the interface occupies only the lower safe area.

## Color

Outer black `#090A10`; upstream fills remain black, `#3E64FF`, `#D8345F`, and `#E3E6E5`; interface text is `#F6F4EE`.

## Typography

The sculpture uses the upstream Orbitron, Montserrat Alternates, Archivo Black, and Open Sans bitmap atlases. UI uses the system sans stack with a monospace micro-label.

## Shape, Material, Light

Preserve the upstream TorusKnot, high-segment sphere, box, plane, shader modules, texture-to-render-target flow, palette, and animation cadence. No replacement canvas approximation.

## Assets

All four original bitmap font atlases and `.fnt` files are retained from the MIT upstream revision. No generated artwork or emoji.

## UI / Icons

UI contains text, progress dots, and a labelled restart button only; no decorative cards or functional iconography.

## Motion / VFX

Each new lock rotates the carousel over 1.05 seconds with an expo-in-out arc. Completion enables direct drag. Reduced motion makes UI transition durations near-instant.

## Translated Reference

Visual parity means the four original effects, camera arrangement, meshes, shader materials, and text-to-texture method remain intact. AlterU adds only name substitution, touch discovery, four-lock closure, and lifecycle pause.

## Anti-patterns

Do not add a countdown, score, generic particle overlay, glowing card UI, emoji controls, or unrelated replacement geometry. Do not cover the sculpture with onboarding copy.

## Vertical-slice Acceptance

At 390×844 and 320×568, the first touch visibly rotates to a real shader state, all four locks are reachable, completion permits drag, and restart returns to the first state without refresh.
