# Last Stand: Fortress

A browser-based 2D fortress-defense game built with vanilla JavaScript and the HTML Canvas API. Build defenses, manage resources, and protect your Town Hall as enemy waves become more challenging.

## Gameplay

- Place buildable foundations on grass tiles before constructing defenses.
- Build and upgrade defensive structures, including towers, barracks, and resource-generating mines.
- Prepare during the build phase, then defend against incoming enemy waves.
- Survive successive map levels while keeping the Town Hall standing.
- Use the in-game **Help** and **Story** screens for instructions and background.

## Tech Stack

| Technology | Purpose |
| --- | --- |
| JavaScript | Game logic, level management, and entity behavior |
| HTML5 Canvas | 2D rendering and pointer interaction |
| HTML/CSS | Browser entry point and canvas presentation |
| Browser APIs | Animation frames, keyboard/mouse input, and audio |

The game uses custom JavaScript classes rather than a third-party game engine or backend.

## Run Locally

No Node.js dependencies, build tooling, or database are required.

1. Clone the repository:
   ```bash
   git clone https://github.com/alialnabulsi/Last-Stand-Fortress.git
   cd Last-Stand-Fortress
   ```
2. Run a static local server, for example:
   ```bash
   python -m http.server 8000
   ```
3. Open **http://localhost:8000/index.htm** in a desktop browser.
4. Select **Play** to start, or **Help** for the in-game instructions.

Some browser configurations may allow opening `index.htm` directly, but a local server is more reliable for loading assets.

## Project Structure

```text
Last-Stand-Fortress/
├── index.htm             # Canvas and JavaScript entry point
├── index.js              # Game configuration and initialization
├── js/
│   ├── game.js           # Canvas game loop and input handling
│   ├── Components/       # Reusable UI and game objects
│   ├── Enemies/          # Enemy behavior
│   ├── Levels/           # Menu, help, story, and gameplay scenes
│   ├── Shop/             # Defenses, buildings, and shop logic
│   ├── Tiles/            # Map tiles and Town Hall
│   └── Utils/            # Supporting utilities
├── images/               # Game artwork
└── sounds/               # Music and sound effects
```

## Implementation Notes

The `Game` class updates and renders sprites through `requestAnimationFrame`, and listens for keyboard and mouse events. Individual levels initialize their own scenes, while gameplay manages the grid, structures, waves, and audio.

This is a standalone educational game project; it does not expose an API or store user accounts.
