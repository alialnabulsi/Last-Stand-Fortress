class Sprite {
  constructor() {}
  update() {
    return false;
  }
  draw(ctx) {}
}

class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.arrayOfSprites = [];
    this.keys = {};
    this.currentLevelIndex = 0;
    this.levels = [];
    this.mouse = { x: 0, y: 0, clicked: false };
    this.bindKeyboardEvents();
    this.bindMouseEvents();
  }

  addSprite(sprite) {
    this.arrayOfSprites.push(sprite);
  }

  update() {
    let updatedarrayOfSprites = [];
    for (let sprite of this.arrayOfSprites) {
      if (!sprite.update(this.arrayOfSprites, this.keys, this.mouse)) {
        updatedarrayOfSprites.push(sprite);
      }
    }
    this.arrayOfSprites = updatedarrayOfSprites;

    if (this.pendingLevelIndex !== null) {
      this.setLevel(this.pendingLevelIndex);
      this.pendingLevelIndex = null;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.arrayOfSprites.forEach((sprite) => sprite.draw(this.ctx));
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }

  addLevel(level) {
    this.levels.push(level);

    if (this.levels.length === 1) {
      this.setLevel(0);
    }
  }

  setLevel(index) {
    if (index >= 0 && index < this.levels.length) {
      this.arrayOfSprites = [];
      this.currentLevelIndex = index;
      this.levels[index].initialize();
    }
  }
  changeLevel(index) {
    this.pendingLevelIndex = index;
  }

  nextLevel() {
    this.setLevel(this.currentLevelIndex + 1);
  }

  previousLevel() {
    this.setLevel(this.currentLevelIndex - 1);
  }

  bindKeyboardEvents() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }
  bindMouseEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      //console.log(" mousemove:" + this.mouse.x + ", " + this.mouse.y);
    });

    this.canvas.addEventListener("mousedown", () => {
      this.mouse.down = true;
      this.mouse.clicked = true; // Tracks single clicks
    });

    this.canvas.addEventListener("mouseup", () => {
      this.mouse.down = false;
    });

    this.canvas.addEventListener("mouseleave", () => {
      this.mouse.down = false;
    });
  }
}

class Level {
  constructor(game) {
    this.game = game;
  }
  initialize() {}
}
