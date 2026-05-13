# Sky Skate
A physics-based skateboarding game built with Phaser 4 and Matter.js.

## Play the Game
[Play Sky Skate](https://alexflores01.github.io/CMPM120-Physics/)

## How to Play
- **Click** on the floating rock to attach a rope and swing
- **Arrow keys** to move left and right
- **Up arrow** to jump (4 second cooldown)
- Collect the **cash** to reveal the goal
- Reach the **goal** to complete the level

## Gameplay Design
The player's goal is achieved indirectly through physics — swinging on a rope
to build momentum, collecting items, and reaching the goal zone. The game uses:
- **Continuous input**: mouse click and hold to swing the rope
- **Discrete input**: arrow keys and jump button
- 3 physics-based gameplay scenes (Park, Rooftops, Sky)
- Menu and Summary scenes to separate and contextualize the gameplay

## Scenes
- **Menu** — title screen
- **Park** — Level 1
- **Rooftops** — Level 2
- **Sky** — Level 3
- **Summary** — shows time per level and total time

## Assets
Game art assets from:
[Free Green Zone Tileset - Pixel Art](https://free-game-assets.itch.io/free-green-zone-tileset-pixel-art)
by free-game-assets on itch.io, used under their free license.

## Built With
- [Phaser 4](https://phaser.io)
- Matter.js (physics engine, bundled with Phaser)