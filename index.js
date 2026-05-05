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
    GRASS: 0, // Normal ground / decoration
    BUILDABLE: 1, // Player can place towers/buildings here
    BLOCKED: 2, // Rocks, ruins, obstacles
    TOWN_HALL: 3, // Main base / enemy target
    PATH: 4, // Enemy walking path
    WATER: 5, // Outer water border
    FOREST: 6, // Trees / outer decoration
    SPAWNER: 7, // Enemy spawn point
    TROOP_ZONE: 8, // Area where troops stand/load
    RESOURCE_ZONE: 9, // Area for gold/resource buildings
  },
  //Map
  MAP: {
   map_1: [
  // 00
  [5,6,6,5,6,6,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,7,5,5,5,5,5,5,5],

  // 01
  [5,6,6,6,5,6,4,4,4,4,4,4,4,6,8,8,8,8,8,8,8,8,8,8,8,8,8,6,6,5,5,5,4,5,5,5,6,6,5,5],

  // 02
  [5,6,6,6,5,6,6,6,6,6,6,6,4,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,6,5,4,4,5,5,6,6,6,5,5],

  // 03
  [5,6,6,5,6,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,6,4,5,5,6,6,6,6,6,5],

  // 04
  [5,5,5,6,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,6,6,6,6,6,6,5],

  // 05
  [5,6,6,6,6,6,6,6,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,8,8,6,6,6,6,6,6,6,5],

  // 06
  [5,6,7,4,4,4,4,6,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,8,8,6,6,4,4,4,4,7,5],

  // 07
  [5,6,6,6,6,6,4,6,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,6,4,4,4,4,6,6,6,6,5],

  // 08
  [5,6,6,8,8,8,8,8,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,6,6,6,6,6,8,8,6,6,5],

  // 09
  [5,6,6,8,8,8,8,8,8,8,8,8,8,8,8,1,1,1,1,3,3,1,1,1,1,8,8,8,8,8,8,8,8,8,8,8,8,6,6,5],

  // 10
  [5,6,6,8,8,8,8,8,8,8,8,8,8,8,8,1,1,1,1,3,3,1,1,1,1,8,8,8,8,8,8,8,8,6,4,6,6,6,6,5],

  // 11
  [5,6,6,8,8,8,8,8,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,8,8,8,6,4,4,6,6,6,5],

  // 12
  [5,6,6,6,6,6,6,8,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,8,8,8,8,6,4,4,4,6,5],

  // 13
  [5,6,7,4,4,4,4,8,8,8,8,8,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,8,8,8,8,8,8,6,6,4,7,5],

  // 14
  [5,6,6,6,6,6,6,8,8,6,6,6,8,8,8,1,1,1,1,1,1,1,1,1,1,8,8,8,8,6,6,6,6,6,8,8,8,6,6,5],

  // 15
  [5,5,5,5,5,6,8,8,8,4,4,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,4,4,4,6,8,8,8,8,6,5],

  // 16
  [5,6,6,6,5,6,6,6,6,6,4,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,4,6,4,6,8,8,6,6,6,5],

  // 17
  [5,6,5,5,5,5,5,5,6,4,4,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,4,6,8,8,8,8,6,5,5,5],

  // 18
  [5,5,5,6,6,6,6,6,6,4,6,6,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,6,4,6,8,8,8,6,5,5,6,5],

  // 19
  [5,6,6,6,6,6,6,6,6,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,6,6,6,6,5,6,6,6,5],
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
      img.src = "images/tiles/Grass.png";
      return img;
    })(),

    Buildable: (() => {
      const img = new Image();
      img.src = "images/tiles/Buildable.png";
      return img;
    })(),

    Blocked: (() => {
      const img = new Image();
      img.src = "images/tiles/Blocked.png";
      return img;
    })(),

    Path: (() => {
      const img = new Image();
      img.src = "images/tiles/Path.png";
      return img;
    })(),

    Water: (() => {
      const img = new Image();
      img.src = "images/tiles/Water.png";
      return img;
    })(),

    Forest: (() => {
      const img = new Image();
      img.src = "images/tiles/Forest.png";
      return img;
    })(),

    Spawner: (() => {
      const img = new Image();
      img.src = "images/tiles/Spawner.png";
      return img;
    })(),

    TroopZone: (() => {
      const img = new Image();
      img.src = "images/tiles/TroopZone.png";
      return img;
    })(),

    ResourceZone: (() => {
      const img = new Image();
      img.src = "images/tiles/TroopZone.png";
      return img;
    })(),

    TownHall: (() => {
      const img = new Image();
      img.src = "images/tiles/TownHall.png";
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
