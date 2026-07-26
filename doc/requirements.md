# Requirements

## 1. Overview

Kinetic Name is a 45–90 second self-paced mobile visual toy: the player touches the scene four times to reveal their own name through four original Three.js typography compositions, then drags to inspect the completed carousel.

## 2. Visual Design

The full-screen WebGL scene is the primary surface. A quiet bottom-safe-area label, four 8px progress dots, and one 44px restart control sit over it; the original four geometry/material states remain the brightest visual element. Target viewports are 390×844 and 320×568 portrait.

## 3. Game Mechanics

The scene contains four upstream objects at 90-degree intervals around a radius-50 ring. Each intentional first four pointer-down events locks one composition; rotation tween duration is 1.05 seconds. After the fourth lock, horizontal drag adds 0.006 radians per CSS pixel to the carousel yaw. There is no timer, score, failure state, or leaderboard.

## 4. Controls

Pointer-down anywhere on the canvas locks the next form and immediately begins the real rotation. After four forms are locked, single-finger horizontal drag freely rotates the completed sculpture. The restart button resets the four locks and scene rotation. Keyboard-only use can focus and activate restart.

## 5. Win / Lose Conditions

The experience completes when all four forms are locked. Its result is the freely viewable name carousel plus a restart action. It has no loss condition, countdown, or forced exit.

## 6. Sound Effects

No audio is used in version 1.0; the immediate shader transition is the acknowledgement. This avoids requesting audio permission for a contemplative visual toy.
