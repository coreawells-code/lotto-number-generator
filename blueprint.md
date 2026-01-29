# Blueprint: Space Shooter Game

## Overview

This project is a classic arcade-style space shooter game, reminiscent of 'Galaga'. It's built entirely with HTML, CSS, and JavaScript, using the HTML Canvas for rendering. The game is designed to be playable on both desktop (with keyboard) and mobile (with touch controls).

## Design & Style

*   **Theme:** Retro Sci-Fi, 8-bit arcade aesthetic.
*   **Layout:** A single, full-screen canvas where the game takes place. Score and other UI elements will be overlaid on top.
*   **Color Palette:**
    *   Background: Deep space black (`#000`).
    *   Player Ship: Heroic blue or white.
    *   Enemy Ships: Menacing reds, purples, and greens.
    *   Projectiles: Bright, contrasting colors (e.g., yellow for player, pink for enemies).
    *   Text/UI: Classic arcade font, bright white or yellow.
*   **Graphics:** Simple, pixel-art style graphics for the player, enemies, and explosions, all drawn programmatically on the canvas.
*   **Sound (Optional Future Feature):** Simple sound effects for shooting, explosions, and background music could be added later.

## Features

*   **Player Control:**
    *   Desktop: The player's ship moves left and right using the Arrow Keys or 'A' and 'D' keys.
    *   Mobile: The player's ship follows the user's finger (touch-and-drag).
    *   Shooting: The player can fire projectiles upwards by pressing the Spacebar or tapping the screen.
*   **Enemies:** Swarms of enemy ships will appear from the top of the screen, moving in formation.
*   **Combat:** The player must shoot down enemies to score points.
*   **Scoring:** A visible score counter tracks the player's points.
*   **Lives:** The player will have a limited number of lives. The game ends when all lives are lost.
*   **Game Loop:** A smooth, consistent game loop using `requestAnimationFrame` for rendering.
*   **Collision Detection:** The game will detect collisions between player projectiles and enemies, and between enemy ships and the player.
*   **Responsive Canvas:** The game canvas will adapt to the size of the browser window.

## File Structure

*   `index.html`: Contains the `<canvas>` element and basic UI structure.
*   `style.css`: Styles the page, centers the canvas, and handles UI element positioning.
*   `main.js`: Contains all the game logic, including rendering, controls, and game state management.
