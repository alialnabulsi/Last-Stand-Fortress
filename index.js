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
        5, 5, 5, 5, 5, 6, 1, 1, 1, 40, 45, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 6, 46, 41, 45, 6, 1, 1, 1, 1, 6, 5,
      ],

      // 16
      [
        5, 6, 6, 6, 5, 6, 6, 6, 6, 6, 42, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 6, 42, 6, 42, 6, 1, 1, 6, 6, 6, 5,
      ],

      // 17
      [
        5, 6, 5, 5, 5, 5, 5, 5, 6, 46, 40, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
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
};

const game = new Game();
game.addLevel(new MenuLevel(game, Utils)); //0
game.addLevel(new HelpLevel(game, Utils)); //1
game.addLevel(new StoryLevel(game, Utils)); //2
game.addLevel(new GameLevel(game, Utils)); //3
game.loop();
