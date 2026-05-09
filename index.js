const Utils = {
  //Constant texts
  LevelsTexts: {
    MenuLevel: {
      title: "Last Stand: Fortress",
      startButtonTitle: "Play",
      helpButtonTitle: "Help",
      storyButtonTitle: "Discover Story",
      backButtonTitle: "Back",
    },

    StoryLevel: {
      shortStoryIntro: [
        "The world has fallen.",
        "Your fortress is the last hope.",
        "Waves of enemies are approaching.",
        "They will not stop.",
        "They will not show mercy.",
        "Defend your Bastion… or lose everything.",
      ],
    },
  },
  //Tiles
  TILE_TYPES: {
    GRASS: 1, // Normal ground / decoration
    BUILDABLE: 0, // Player can place towers/buildings here
    BLOCKED: 2, // Rocks, ruins, obstacles
    TOWN_HALL: 3, // Main base / enemy target
    CROSS: 40,
    HORZ: 41,
    VERT: 42,
    BRIGHT: 43,
    BLEFT: 44,
    TRIGHT: 45,
    TLEFT: 46,
    WATER: 5, // Outer water border
    FOREST: 6, // Trees / outer decoration
    SPAWNER: 7, // Enemy spawn point
    RESOURCE_ZONE: 9, // Area for gold/resource buildings
  },

  //Map
  MAP: {
    map_1: [
      // 00
      [
        5, 6, 6, 5, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 5, 5, 5, 5, 7, 5, 5, 5, 5, 5, 5, 5,
      ],

      // 01
      [
        5, 6, 6, 6, 5, 6, 44, 41, 41, 41, 41, 41, 45, 6, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 6, 6, 5, 5, 5, 42, 5, 5, 5, 6, 6, 5, 5,
      ],

      // 02
      [
        5, 6, 6, 6, 5, 6, 6, 6, 6, 6, 6, 6, 42, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 6, 6, 5, 46, 43, 5, 5, 6, 6, 6, 5, 5,
      ],

      // 03
      [
        5, 6, 6, 5, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 6, 6, 42, 5, 5, 6, 6, 6, 6, 6, 5,
      ],

      // 04
      [
        5, 5, 5, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 5,
      ],

      // 05
      [
        5, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 5,
      ],

      // 06
      [
        5, 6, 7, 41, 41, 41, 45, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 46, 41, 41, 41, 7, 5,
      ],

      // 07
      [
        5, 6, 6, 6, 6, 6, 42, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 6, 44, 41, 41, 43, 6, 6, 6, 6, 5,
      ],

      // 08
      [
        5, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 1, 1, 6, 6, 5,
      ],

      // 09
      [
        5, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 5,
      ],

      // 10
      [
        5, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 42, 6, 6, 6, 6, 5,
      ],

      // 11
      [
        5, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 44, 45, 6, 6, 6, 5,
      ],

      // 12
      [
        5, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 44, 41, 45, 6, 5,
      ],

      // 13
      [
        5, 6, 7, 41, 41, 41, 41, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 44, 7, 5,
      ],

      // 14
      [
        5, 6, 6, 6, 6, 6, 6, 1, 1, 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 1, 1, 1, 6, 6, 5,
      ],

      // 15
      [
        5, 5, 5, 5, 5, 6, 1, 1, 1, 41, 45, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 6, 46, 41, 45, 6, 1, 1, 1, 1, 6, 5,
      ],

      // 16
      [
        5, 6, 6, 6, 5, 6, 6, 6, 6, 6, 42, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 6, 42, 6, 42, 6, 1, 1, 6, 6, 6, 5,
      ],

      // 17
      [
        5, 6, 5, 5, 5, 5, 5, 5, 6, 46, 43, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 6, 42, 6, 1, 1, 1, 1, 6, 5, 5, 5,
      ],

      // 18
      [
        5, 5, 5, 6, 6, 6, 6, 6, 6, 42, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 6, 42, 6, 1, 1, 1, 6, 5, 5, 6, 5,
      ],

      // 19
      [
        5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 5, 6, 6, 6, 5,
      ],
    ],
  },

  //Sounds
  Sounds: {
    storySound: "sounds/storySound.mp3",
  },

  //Images
  BackgroundImages: {
    MenuLevelBackground: "images/MenuBackgroundImage.jpg",
  },

  //Tiles
  Images: {
    Grass: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Grass.png";
      return img;
    })(),

    Enemies: (() => {
      const E1 = new Image();
      E1.src = "images/SpriteSheets/Enemies/1.png";

      const E2 = new Image();
      E2.src = "images/SpriteSheets/Enemies/2.png";

      const E3 = new Image();
      E3.src = "images/SpriteSheets/Enemies/3.png";

      const E4 = new Image();
      E4.src = "images/SpriteSheets/Enemies/4.png";

      return {
        E1,
        E2,
        E3,
        E4,
      };
    })(),

    Buildable: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Buildable.png";
      return img;
    })(),

    Path: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Paths.png";
      return img;
    })(),

    Water: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Water.png";
      return img;
    })(),

    Forest: (() => {
      const image1 = new Image();
      image1.src = "images/SpriteSheets/ForestAnimated.png";

      const image2 = new Image();
      image2.src = "images/SpriteSheets/ForestObjects.png";

      return {
        image1,
        image2,
      };
    })(),
    Spawner: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Spawner.png";
      return img;
    })(),

    TownHall: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/TownHall.png";
      return img;
    })(),
  },
  // ===============================
  // ===============================
  // PANEL STATIC CONFIG (UI ONLY)
  // ===============================
  Panel: {
    layout: {
      x: 0,
      y: 800,
      width: 1600,
      height: 200,
      shop: { x: 12, y: 812, width: 835, height: 176 },
      game: { x: 865, y: 812, width: 285, height: 176 },
      info: { x: 1160, y: 812, width: 428, height: 176 },
    },

    titles: {
      shop: "SHOP",
      game: "DEFENSE",
      info: "FORTRESS INFO",
    },

    style: {
      panelTop: "#3a2a1b",
      panelMiddle: "#1d1510",
      panelBottom: "#090706",
      border: "#c69a3a",
      sectionFill: "rgba(0, 0, 0, 0.30)",
      sectionBorder: "rgba(230, 180, 70, 0.75)",
      titleColor: "#ffd166",
      textColor: "#ffffff",
      mutedText: "#d6c8a5",
      danger: "#ff7070",
      good: "#7dff9d",
      buttonFill: "#3b2a1d",
      buttonHover: "#4b3625",
      buttonSelected: "#73521f",
      buttonDisabled: "#242424",
      buttonBorder: "#c49a45",
    },

    shopButton: {
      width: 150,
      height: 58,
      gap: 10,
      startX: 28,
      startY: 872,
      columns: 5,
    },

    shopItems: [
      { id: "buildable_tile", label: "Build", fullName: "Build Tile", icon: "⬚", description: "Create slot", category: "buildable" },
      { id: "gold_mine", label: "Gold", fullName: "Gold Mine", icon: "◆", description: "Gold income", category: "resource" },
      { id: "barracks", label: "Barracks", fullName: "Barracks", icon: "⚑", description: "Train troops", category: "military" },
      { id: "archer", label: "Archer", fullName: "Archer", icon: "➶", description: "Ranged unit", category: "unit" },
      { id: "cannon", label: "Cannon", fullName: "Cannon", icon: "◉", description: "Heavy defense", category: "tower" },
      { id: "wizard", label: "Wizard", fullName: "Wizard", icon: "✦", description: "Magic damage", category: "tower" },
      { id: "inferno_tower", label: "Inferno", fullName: "Inferno Tower", icon: "🔥", description: "Burning beam", category: "tower" },
    ],
  },
};

const game = new Game();
game.addLevel(new MenuLevel(game, Utils)); //0
game.addLevel(new HelpLevel(game, Utils)); //1
game.addLevel(new StoryLevel(game, Utils)); //2
game.addLevel(new GameLevel(game, Utils)); //3
game.loop();
