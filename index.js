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
    HelpLevel: {
      helpLines: [
        "Objective: defend your Town Hall from every enemy wave.",
        "Start by placing Buildable foundations on grass where you want to construct.",
        "Towers, buildings, and mines can only be placed on Buildable foundations.",
        "Waves begin after the build phase and get stronger as levels progress.",
        "Protect the Town Hall at all costs. If it falls, you lose the game.",
        "Win by surviving the waves and clearing each map level.",
      ],
    },
  },

  LevelScreens: {
    MenuLevel: {
      title: {
        x: 800,
        y: 260,
        style: {
          color: "#e8d174",
          font: "bold 64px Georgia",
          shadow: false,
          stroke: false,
        },
      },
      subtitle: {
        x: 800,
        y: 325,
        text: "Defend the Town Hall. Survive every wave.",
        style: {
          color: "#f4f1e6",
          font: "26px Georgia",
          shadow: true,
          stroke: true,
        },
      },
      buttons: {
        x: 650,
        width: 300,
        height: 56,
        startY: 430,
        gapY: 85,
      },
    },

    StoryLevel: {
      title: {
        x: 800,
        y: 110,
        text: "Story",
        style: {
          font: "bold 58px Georgia",
          color: "#e8d174",
          shadow: true,
          stroke: true,
        },
      },
      lines: {
        x: 800,
        startY: 235,
        gapY: 85,
        maxWidth: 1380,
        style: {
          font: "30px Georgia",
          color: "#f2f2f2",
          shadow: true,
          stroke: true,
        },
        lastLineStyle: {
          font: "bold 36px Georgia",
          color: "#ffd27d",
          shadow: true,
          stroke: true,
        },
      },
      backButton: {
        x: 100,
        y: 800,
        width: 300,
        height: 56,
      },
    },

    HelpLevel: {
      title: {
        x: 800,
        y: 115,
        text: "How to Play",
        style: {
          color: "#e8d174",
          font: "bold 58px Georgia",
          shadow: true,
          stroke: true,
        },
      },
      lines: {
        x: 190,
        startY: 220,
        gapY: 88,
        style: {
          color: "#f7f6f2",
          font: "29px Georgia",
          align: "left",
          baseline: "middle",
          maxWidth: 1220,
          shadow: true,
          stroke: true,
        },
      },
      backButton: {
        x: 100,
        y: 800,
        width: 300,
        height: 56,
      },
    },
  },

  SOUNDS: {
    MENU: {
      MUSIC: {
        id: "entryMusic",
        volume: 0.6,
        loop: true,
      },
    },

    HELP: {
      MUSIC: {
        id: "entryMusic2",
        volume: 0.6,
        loop: true,
      },
    },

    STORY: {
      MUSIC: {
        id: "storySound",
        volume: 0.6,
        loop: true,
      },
    },

    GAME: {
      STATE_MAP: {
        IDLE: "IDLE",
        PREPARATION: "PLANNING",
        BREAK: "PLANNING",
        UNDER_ATTACK: "COMBAT",
      },

      IDLE: [
        { id: "Home_Village_Music1", volume: 0.5, loop: true },
        { id: "Home_Village_Music2", volume: 0.5, loop: true },
        { id: "Home_Village_Music3", volume: 0.5, loop: true },
      ],

      PLANNING: {
        id: "Combat_Planning_Music",
        volume: 0.55,
        loop: true,
      },

      COMBAT: {
        id: "HV_Combat_Music",
        volume: 0.6,
        loop: true,
      },
    },

    SFX: {
      WIN: {
        id: "finalVictory",
        volume: 0.8,
        loop: false,
      },

      LOSE: {
        id: "lost",
        volume: 0.8,
        loop: false,
      },

      SHOP_ITEM_SELECTED: {
        id: "shopItemSelected",
        volume: 0.6,
        loop: false,
      },

      SHOP_ITEM_PLACED: {
        id: "shopItemPlaced",
        volume: 0.65,
        loop: false,
      },

      CANT_BUILD: {
        id: "cantBuild",
        volume: 0.65,
        loop: false,
        cooldownMs: 180,
      },

      ENEMY_HIT_TOWN_HALL: {
        id: "enemyHitTownHall",
        volume: 0.7,
        loop: false,
        cooldownMs: 500,
      },

      LEVEL_1_AND_2_ENEMY: {
        id: "level1and2Enemy",
        volume: 0.55,
        loop: false,
        cooldownMs: 650,
      },

      LEVEL_3_ENEMY: {
        id: "level3Enemy",
        volume: 0.6,
        loop: false,
        cooldownMs: 650,
      },

      LEVEL_4_ENEMY: {
        id: "level4Enemy",
        volume: 0.65,
        loop: false,
        cooldownMs: 650,
      },

      LEVEL_UPGRADE: {
        id: "levelUpgrade",
        volume: 0.75,
        loop: false,
      },
    },
  },
  //Tiles
  TILE_TYPES: {
    GRASS: 1, // Normal ground / decoration
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

  // Map
  MAP: {
    map_1: [
      // 00
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
      // 01
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 6, 6, 1, 1, 1, 1, 42, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 02
      [
        5, 5, 5, 1, 6, 6, 1, 1, 44, 41, 41, 41, 45, 6, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 6, 46, 41, 41, 41, 43, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 03
      [
        6, 1, 6, 6, 1, 1, 6, 1, 1, 1, 1, 1, 42, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        2, 1, 1, 42, 1, 1, 1, 1, 1, 6, 1, 1, 6, 6, 1, 6,
      ],
      // 04
      [
        6, 1, 6, 1, 1, 1, 6, 6, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
        1, 1, 1, 42, 1, 1, 1, 1, 6, 6, 1, 1, 1, 6, 1, 6,
      ],
      // 05
      [
        7, 41, 41, 41, 41, 45, 1, 1, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 46, 41, 41, 41, 41, 7,
      ],
      // 06
      [
        6, 1, 6, 1, 1, 42, 1, 6, 1, 1, 2, 1, 44, 41, 41, 41, 41, 41, 45, 1, 1,
        46, 41, 41, 41, 41, 41, 43, 1, 2, 1, 1, 6, 1, 42, 1, 1, 6, 1, 6,
      ],
      // 07
      [
        6, 1, 6, 6, 1, 44, 41, 41, 41, 41, 45, 1, 1, 1, 1, 1, 1, 1, 42, 1, 1,
        42, 1, 1, 1, 1, 1, 1, 1, 46, 41, 41, 41, 41, 43, 1, 6, 6, 1, 6,
      ],
      // 08
      [
        6, 1, 1, 1, 1, 1, 2, 1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 40, 40, 40, 40,
        1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 1, 2, 1, 1, 1, 1, 1, 6,
      ],
      // 09
      [
        6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 44, 41, 41, 41, 41, 41, 41, 41, 40, 3, 3,
        40, 41, 41, 41, 41, 41, 41, 41, 43, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      ],
      // 10
      [
        6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 40, 3, 3, 40, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      ],
      // 11
      [
        6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 46, 41, 41, 41, 41, 41, 41, 41, 40, 40,
        40, 40, 41, 41, 41, 41, 41, 41, 41, 45, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      ],
      // 12
      [
        6, 1, 6, 6, 1, 46, 41, 41, 41, 41, 43, 1, 1, 1, 1, 1, 1, 1, 1, 40, 40,
        1, 1, 1, 1, 1, 1, 1, 1, 44, 41, 41, 41, 41, 45, 1, 6, 6, 1, 6,
      ],
      // 13
      [
        6, 1, 6, 1, 1, 42, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 46, 41, 41, 40, 40, 41,
        41, 45, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 42, 1, 1, 6, 1, 6,
      ],
      // 14
      [
        7, 41, 41, 41, 41, 43, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 42, 1, 1, 1, 1, 1,
        1, 42, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 44, 41, 41, 41, 41, 7,
      ],
      // 15
      [
        6, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 46, 41, 41, 41, 43, 1, 1, 1, 2, 1,
        1, 44, 41, 41, 41, 45, 1, 1, 1, 1, 1, 1, 1, 1, 6, 6, 1, 6,
      ],
      // 16
      [
        6, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 6, 6, 1, 1, 1, 6,
      ],
      // 17
      [
        5, 5, 5, 1, 1, 1, 1, 1, 46, 41, 41, 41, 43, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 44, 41, 41, 41, 45, 1, 1, 1, 1, 1, 5, 5, 5,
      ],
      // 18
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 6, 6, 1, 5, 5, 5,
      ],
      // 19
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
    ],

    map_2: [
      // 00
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
      // 01
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 6, 6, 1, 1, 1, 1, 42, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 02
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 6, 1, 1, 6, 1, 1, 1, 1, 1, 1, 6,
        1, 1, 6, 1, 1, 1, 1, 42, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 03
      [
        6, 1, 6, 6, 1, 1, 6, 1, 44, 41, 41, 41, 41, 41, 45, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 46, 41, 41, 41, 41, 41, 43, 1, 6, 1, 1, 6, 6, 1, 6,
      ],
      // 04
      [
        6, 1, 6, 1, 1, 1, 6, 6, 1, 6, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 2, 1, 1, 1,
        1, 42, 1, 1, 1, 1, 6, 1, 6, 6, 1, 1, 1, 6, 1, 6,
      ],
      // 05
      [
        7, 41, 41, 41, 45, 1, 1, 1, 6, 1, 1, 1, 1, 2, 40, 41, 41, 45, 1, 1, 1,
        1, 46, 41, 41, 40, 2, 1, 1, 1, 1, 6, 1, 1, 1, 46, 41, 41, 41, 7,
      ],
      // 06
      [
        6, 1, 6, 1, 42, 1, 1, 6, 6, 46, 41, 41, 41, 41, 40, 1, 1, 42, 1, 1, 1,
        1, 42, 1, 1, 40, 41, 41, 41, 41, 45, 6, 6, 1, 1, 42, 1, 6, 1, 6,
      ],
      // 07
      [
        6, 1, 6, 6, 42, 1, 1, 1, 1, 42, 1, 1, 1, 1, 42, 2, 1, 42, 1, 1, 1, 1,
        42, 1, 2, 42, 1, 1, 1, 1, 42, 1, 1, 1, 1, 42, 6, 6, 1, 6,
      ],
      // 08
      [
        6, 1, 1, 6, 44, 41, 41, 41, 41, 43, 1, 1, 1, 1, 42, 1, 1, 40, 40, 40,
        40, 40, 40, 1, 1, 42, 1, 1, 1, 1, 44, 41, 41, 41, 41, 43, 6, 1, 1, 6,
      ],
      // 09
      [
        6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 44, 41, 41, 40, 40, 3, 3, 40,
        40, 41, 41, 43, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      ],
      // 10
      [
        6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 40, 3, 3, 40, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
      ],
      // 11
      [
        6, 1, 1, 1, 46, 41, 41, 41, 41, 45, 1, 1, 1, 1, 46, 41, 41, 40, 40, 40,
        40, 40, 40, 41, 41, 45, 1, 1, 1, 1, 46, 41, 41, 41, 41, 45, 1, 1, 1, 6,
      ],
      // 12
      [
        6, 1, 6, 6, 42, 1, 1, 1, 1, 42, 1, 1, 1, 1, 42, 2, 1, 40, 40, 40, 40,
        40, 40, 1, 2, 42, 1, 1, 1, 1, 42, 1, 1, 1, 1, 42, 6, 6, 1, 6,
      ],
      // 13
      [
        6, 1, 6, 1, 42, 1, 6, 1, 6, 44, 41, 41, 41, 40, 40, 1, 1, 42, 1, 1, 1,
        1, 42, 1, 1, 40, 40, 41, 41, 41, 43, 6, 1, 6, 1, 42, 1, 6, 1, 6,
      ],
      // 14
      [
        7, 41, 41, 41, 43, 1, 1, 1, 1, 6, 1, 1, 2, 40, 40, 41, 41, 43, 1, 1, 1,
        1, 44, 41, 41, 40, 40, 2, 1, 1, 6, 1, 1, 1, 1, 44, 41, 41, 41, 7,
      ],
      // 15
      [
        6, 1, 6, 6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1,
        1, 1, 42, 1, 1, 1, 1, 6, 1, 1, 1, 1, 6, 6, 1, 6,
      ],
      // 16
      [
        6, 1, 1, 1, 6, 6, 1, 1, 46, 41, 41, 41, 41, 43, 1, 1, 1, 1, 2, 1, 1, 2,
        1, 1, 1, 1, 44, 41, 41, 41, 41, 45, 1, 1, 6, 6, 1, 1, 1, 6,
      ],
      // 17
      [
        5, 5, 5, 1, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 6,
        1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 1, 1, 1, 5, 5, 5,
      ],
      // 18
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 6, 6, 1, 5, 5, 5,
      ],
      // 19
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
    ],

    map_3: [
      // 00
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
      // 01
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 6, 6, 1, 1, 1, 1, 42, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 02
      [
        5, 5, 5, 1, 6, 6, 1, 1, 44, 41, 41, 45, 1, 6, 1, 1, 6, 1, 1, 1, 1, 1, 1,
        6, 1, 1, 6, 1, 46, 41, 41, 43, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 03
      [
        6, 1, 6, 6, 1, 1, 6, 1, 1, 1, 6, 42, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
        2, 1, 1, 1, 42, 6, 1, 1, 1, 6, 1, 1, 6, 6, 1, 6,
      ],
      // 04
      [
        6, 1, 6, 1, 1, 1, 6, 6, 1, 6, 1, 44, 41, 41, 41, 45, 1, 1, 1, 1, 2, 1,
        1, 1, 46, 41, 41, 41, 43, 1, 6, 1, 6, 6, 1, 1, 1, 6, 1, 6,
      ],
      // 05
      [
        7, 41, 41, 41, 41, 41, 45, 1, 6, 6, 6, 1, 1, 2, 1, 42, 1, 1, 1, 1, 1, 1,
        1, 1, 42, 1, 2, 1, 1, 6, 6, 6, 1, 46, 41, 41, 41, 41, 41, 7,
      ],
      // 06
      [
        6, 1, 6, 1, 1, 1, 44, 41, 41, 41, 41, 45, 1, 1, 2, 42, 1, 1, 1, 1, 1, 1,
        1, 1, 42, 2, 1, 1, 46, 41, 41, 41, 41, 43, 1, 1, 1, 6, 1, 6,
      ],
      // 07
      [
        6, 1, 6, 6, 1, 1, 6, 1, 1, 1, 1, 42, 1, 1, 1, 40, 41, 41, 45, 1, 1, 46,
        41, 41, 40, 1, 1, 1, 42, 1, 1, 1, 1, 6, 1, 1, 6, 6, 1, 6,
      ],
      // 08
      [
        6, 1, 1, 6, 1, 1, 2, 6, 1, 1, 1, 44, 41, 41, 41, 40, 1, 1, 40, 40, 40,
        40, 1, 1, 40, 41, 41, 41, 43, 1, 1, 1, 6, 2, 1, 1, 6, 1, 1, 6,
      ],
      // 09
      [
        6, 1, 1, 1, 1, 6, 1, 2, 1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 40, 3, 3, 40, 1,
        1, 42, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 6,
      ],
      // 10
      [
        6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 40, 40, 40, 40, 3, 3, 40,
        40, 40, 40, 1, 1, 1, 1, 1, 1, 1, 2, 1, 6, 1, 1, 1, 1, 6,
      ],
      // 11
      [
        6, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 40, 40, 40, 40, 40, 40, 40,
        40, 40, 40, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 6,
      ],
      // 12
      [
        6, 1, 6, 6, 1, 1, 1, 6, 1, 1, 1, 46, 41, 41, 41, 43, 1, 1, 1, 40, 40, 1,
        1, 1, 44, 41, 41, 41, 45, 1, 1, 1, 6, 1, 1, 1, 6, 6, 1, 6,
      ],
      // 13
      [
        6, 1, 6, 1, 1, 1, 46, 41, 41, 41, 41, 43, 1, 2, 2, 1, 1, 46, 41, 40, 40,
        41, 45, 1, 1, 2, 2, 1, 44, 41, 41, 41, 41, 45, 1, 1, 1, 6, 1, 6,
      ],
      // 14
      [
        7, 41, 41, 41, 41, 41, 43, 1, 1, 6, 6, 1, 2, 1, 1, 1, 1, 42, 1, 1, 1, 1,
        42, 1, 1, 1, 1, 2, 1, 6, 6, 1, 1, 44, 41, 41, 41, 41, 41, 7,
      ],
      // 15
      [
        6, 1, 6, 6, 1, 1, 1, 1, 6, 6, 1, 1, 1, 46, 41, 41, 41, 43, 1, 1, 2, 1,
        44, 41, 41, 41, 45, 1, 1, 1, 6, 6, 1, 1, 1, 1, 6, 6, 1, 6,
      ],
      // 16
      [
        6, 1, 1, 1, 6, 6, 1, 1, 1, 1, 6, 1, 1, 42, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1,
        1, 1, 42, 1, 1, 6, 1, 1, 1, 1, 6, 6, 1, 1, 1, 6,
      ],
      // 17
      [
        5, 5, 5, 1, 1, 1, 1, 1, 46, 41, 41, 41, 41, 43, 1, 1, 6, 1, 1, 1, 1, 1,
        1, 6, 1, 1, 44, 41, 41, 41, 41, 45, 1, 1, 1, 1, 1, 5, 5, 5,
      ],
      // 18
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 6, 6, 1, 5, 5, 5,
      ],
      // 19
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
    ],

    map_4: [
      // 00
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
      // 01
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 6, 6, 1, 1, 1, 1, 42, 1, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 02
      [
        5, 5, 5, 1, 6, 6, 1, 6, 42, 1, 1, 1, 1, 6, 1, 1, 6, 1, 1, 1, 1, 1, 1, 6,
        1, 1, 6, 1, 1, 1, 1, 42, 6, 1, 1, 6, 6, 5, 5, 5,
      ],
      // 03
      [
        6, 1, 6, 6, 1, 1, 6, 1, 44, 41, 41, 41, 41, 45, 1, 2, 1, 1, 1, 1, 1, 1,
        1, 1, 2, 1, 46, 41, 41, 41, 41, 43, 1, 6, 1, 1, 6, 6, 1, 6,
      ],
      // 04
      [
        6, 1, 6, 1, 1, 1, 6, 6, 1, 6, 1, 6, 6, 42, 1, 1, 1, 1, 2, 1, 2, 2, 1, 1,
        1, 1, 42, 6, 6, 1, 6, 1, 6, 6, 1, 1, 1, 6, 1, 6,
      ],
      // 05
      [
        7, 41, 41, 41, 41, 41, 41, 45, 6, 6, 6, 6, 1, 42, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 42, 1, 6, 6, 6, 6, 46, 41, 41, 41, 41, 41, 41, 7,
      ],
      // 06
      [
        6, 1, 6, 1, 1, 1, 1, 42, 6, 6, 2, 6, 1, 44, 41, 41, 41, 45, 1, 1, 1, 1,
        46, 41, 41, 41, 43, 1, 6, 2, 6, 6, 42, 1, 1, 1, 1, 6, 1, 6,
      ],
      // 07
      [
        6, 1, 6, 6, 1, 1, 6, 44, 41, 41, 41, 41, 45, 1, 1, 2, 1, 42, 1, 1, 1, 1,
        42, 1, 2, 1, 1, 46, 41, 41, 41, 41, 43, 6, 1, 1, 6, 6, 1, 6,
      ],
      // 08
      [
        6, 1, 1, 6, 6, 6, 2, 6, 1, 1, 1, 1, 42, 1, 2, 1, 1, 40, 40, 40, 40, 40,
        40, 1, 1, 2, 1, 42, 1, 1, 1, 1, 6, 2, 6, 6, 6, 1, 1, 6,
      ],
      // 09
      [
        6, 1, 1, 1, 1, 6, 1, 2, 1, 1, 1, 1, 44, 41, 41, 41, 41, 40, 40, 3, 3,
        40, 40, 41, 41, 41, 41, 43, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 6,
      ],
      // 10
      [
        6, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 40, 3, 3, 40, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 6, 1, 1, 1, 1, 6,
      ],
      // 11
      [
        6, 1, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 46, 41, 41, 41, 41, 41, 40, 40, 40,
        40, 41, 41, 41, 41, 41, 45, 1, 1, 1, 1, 1, 1, 6, 6, 1, 1, 1, 6,
      ],
      // 12
      [
        6, 1, 6, 6, 1, 1, 1, 46, 41, 41, 41, 41, 43, 1, 1, 2, 1, 1, 42, 1, 1,
        42, 1, 1, 2, 1, 1, 44, 41, 41, 41, 41, 45, 1, 1, 1, 6, 6, 1, 6,
      ],
      // 13
      [
        6, 1, 6, 1, 1, 1, 6, 42, 6, 6, 1, 6, 1, 2, 2, 1, 1, 1, 42, 1, 1, 42, 1,
        1, 1, 2, 2, 1, 6, 1, 6, 6, 42, 6, 1, 1, 1, 6, 1, 6,
      ],
      // 14
      [
        7, 41, 41, 41, 41, 41, 41, 43, 1, 6, 6, 6, 2, 1, 46, 41, 41, 41, 43, 1,
        1, 44, 41, 41, 41, 45, 1, 2, 6, 6, 6, 1, 44, 41, 41, 41, 41, 41, 41, 7,
      ],
      // 15
      [
        6, 1, 6, 6, 1, 1, 1, 1, 6, 6, 1, 6, 1, 1, 42, 1, 1, 1, 2, 1, 2, 2, 1, 1,
        1, 42, 1, 1, 6, 1, 6, 6, 1, 1, 1, 1, 6, 6, 1, 6,
      ],
      // 16
      [
        6, 1, 1, 1, 6, 6, 1, 1, 46, 41, 41, 41, 41, 41, 43, 1, 1, 1, 2, 1, 1, 2,
        1, 1, 1, 44, 41, 41, 41, 41, 41, 45, 1, 1, 6, 6, 1, 1, 1, 6,
      ],
      // 17
      [
        5, 5, 5, 1, 1, 1, 1, 6, 42, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 6,
        1, 1, 1, 1, 1, 1, 1, 42, 6, 1, 1, 1, 1, 5, 5, 5,
      ],
      // 18
      [
        5, 5, 5, 1, 6, 6, 1, 1, 42, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 1, 42, 1, 1, 6, 6, 1, 5, 5, 5,
      ],
      // 19
      [
        5, 5, 5, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
        6, 6, 6, 6, 6, 6, 6, 7, 6, 6, 6, 6, 6, 5, 5, 5,
      ],
    ],
  },

  //Images
  BackgroundImages: {
    MenuLevelBackground: "images/MenuBackgroundImage.jpg",
  },

  //Tiles
  Images: {
    Grass: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Tiles/Grass.png";
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
      img.src = "images/SpriteSheets/Tiles/Buildable.png";
      return img;
    })(),

    Path: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Tiles/Paths.png";
      return img;
    })(),

    Water: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Tiles/Water.png";
      return img;
    })(),

    Forest: (() => {
      const image1 = new Image();
      image1.src = "images/SpriteSheets/Tiles/ForestAnimated.png";

      const image2 = new Image();
      image2.src = "images/SpriteSheets/Tiles/ForestObjects.png";

      return {
        image1,
        image2,
      };
    })(),
    Spawner: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Tiles/Spawner.png";
      return img;
    })(),

    TownHall: (() => {
      const img = new Image();
      img.src = "images/SpriteSheets/Tiles/TownHall.png";
      return img;
    })(),
  },



  ShopItemsData: {
    buildable_tile: { id: "buildable_tile", type: "foundation", cost: 1, unlockLevel: 1, placement: "grass", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/Buildable.png"; return img; })(), placeholderColor: "#5c6b73", frameWidth: 40, frameHeight: 40, idleFrameCount: 1, frameDurationMs: 200 },
    gold_mine: { id: "gold_mine", type: "resource", cost: 1, unlockLevel: 1, placement: "buildable", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/GoldMine.png"; return img; })(), placeholderColor: "#d6b14a", frameWidth: 40, frameHeight: 40, idleFrameCount: 5, frameDurationMs: 130, productionAmount: 12, productionIntervalMs: 4500 },
    barracks: { id: "barracks", type: "military", cost: 1, unlockLevel: 2, placement: "buildable", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/Barrack.png"; return img; })(), placeholderColor: "#8e9aa7", frameWidth: 40, frameHeight: 40, idleFrameCount: 5, frameDurationMs: 150, troopCapacityBonus: 10 },
    archer: { id: "archer", type: "defense", cost: 1, unlockLevel: 1, placement: "buildable", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/Archer.png"; return img; })(), placeholderColor: "#7cb342", frameWidth: 40, frameHeight: 40, idleFrameCount: 1, attackFrameStart: 0, attackFrameCount: 5, frameDurationMs: 110, range: 120, damage: 4, attackCooldownMs: 550, targetType: "ground" },
    cannon: { id: "cannon", type: "defense", cost: 1, unlockLevel: 2, placement: "buildable", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/Cannon.png"; return img; })(), placeholderColor: "#616161", frameWidth: 40, frameHeight: 40, idleFrameCount: 1, attackFrameStart: 0, attackFrameCount: 5, frameDurationMs: 125, range: 130, damage: 10, attackCooldownMs: 1100, targetType: "ground" },
    wizard: { id: "wizard", type: "defense", cost: 1, unlockLevel: 3, placement: "buildable", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/Wizard.png"; return img; })(), placeholderColor: "#9575cd", frameWidth: 40, frameHeight: 40, idleFrameCount: 1, attackFrameStart: 0, attackFrameCount: 5, frameDurationMs: 120, range: 150, damage: 8, attackCooldownMs: 800, targetType: "ground" },
    inferno_tower: { id: "inferno_tower", type: "defense", cost: 1, unlockLevel: 4, placement: "buildable", image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Shop/Inferno.png"; return img; })(), placeholderColor: "#ef6c00", frameWidth: 40, frameHeight: 40, idleFrameCount: 1, attackFrameStart: 0, attackFrameCount: 5, frameDurationMs: 110, range: 165, damage: 16, attackCooldownMs: 1400, targetType: "ground" },
  },

  EnemyData: {
    default: {
      image: null,
      maxHp: 10,
      speed: 1,
      damage: 1,
      frameWidth: 40,
      frameHeight: 40,
    },
    byLevel: {
      1: { image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Enemies/1.png"; return img; })(), maxHp: 10, speed: 1, damage: 1, frameWidth: 40, frameHeight: 40 },
      2: { image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Enemies/2.png"; return img; })(), maxHp: 10, speed: 1, damage: 1, frameWidth: 40, frameHeight: 40 },
      3: { image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Enemies/3.png"; return img; })(), maxHp: 10, speed: 1, damage: 1, frameWidth: 40, frameHeight: 40 },
      4: { image: (() => { const img = new Image(); img.src = "images/SpriteSheets/Enemies/4.png"; return img; })(), maxHp: 10, speed: 1, damage: 1, frameWidth: 40, frameHeight: 40 },
    },
  },

  WaveData: {
    maxLevel: 4,
    default: {
      level: 1,
      waves: [
        { wave: 1, enemyLevel: 1, enemyCount: 5, enemyHp: 12, enemySpeed: 0.95, enemyDamage: 6, enemyGoldReward: 14, enemyXpReward: 6, spawnDelaySeconds: 1.15 },
        { wave: 2, enemyLevel: 1, enemyCount: 6, enemyHp: 13, enemySpeed: 0.98, enemyDamage: 6, enemyGoldReward: 14, enemyXpReward: 6, spawnDelaySeconds: 1.05 },
      ],
    },
    levels: {
      1: {
        level: 1,
        waves: [
          { wave: 1, enemyLevel: 1, enemyCount: 5, enemyHp: 12, enemySpeed: 0.95, enemyDamage: 6, enemyGoldReward: 14, enemyXpReward: 6, spawnDelaySeconds: 1.15 },
          { wave: 2, enemyLevel: 1, enemyCount: 6, enemyHp: 13, enemySpeed: 0.98, enemyDamage: 6, enemyGoldReward: 14, enemyXpReward: 6, spawnDelaySeconds: 1.05 },
        ],
      },
      2: {
        level: 2,
        waves: [
          { wave: 1, enemyLevel: 2, enemyCount: 7, enemyHp: 17, enemySpeed: 1.03, enemyDamage: 8, enemyGoldReward: 16, enemyXpReward: 8, spawnDelaySeconds: 1.0 },
          { wave: 2, enemyLevel: 2, enemyCount: 8, enemyHp: 18, enemySpeed: 1.05, enemyDamage: 8, enemyGoldReward: 16, enemyXpReward: 8, spawnDelaySeconds: 0.95 },
        ],
      },
      3: {
        level: 3,
        waves: [
          { wave: 1, enemyLevel: 3, enemyCount: 9, enemyHp: 24, enemySpeed: 1.08, enemyDamage: 10, enemyGoldReward: 18, enemyXpReward: 10, spawnDelaySeconds: 0.9 },
          { wave: 2, enemyLevel: 3, enemyCount: 10, enemyHp: 26, enemySpeed: 1.1, enemyDamage: 10, enemyGoldReward: 18, enemyXpReward: 10, spawnDelaySeconds: 0.85 },
        ],
      },
      4: {
        level: 4,
        waves: [
          { wave: 1, enemyLevel: 4, enemyCount: 11, enemyHp: 34, enemySpeed: 1.13, enemyDamage: 12, enemyGoldReward: 20, enemyXpReward: 12, spawnDelaySeconds: 0.8 },
          { wave: 2, enemyLevel: 4, enemyCount: 12, enemyHp: 36, enemySpeed: 1.15, enemyDamage: 13, enemyGoldReward: 20, enemyXpReward: 12, spawnDelaySeconds: 0.75 },
        ],
      },
    },
  },

  TownHallData: {
    maxHp: 1,
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
      shop: { x: 12, y: 812, width: 700, height: 176 },
      game: { x: 710, y: 812, width: 420, height: 176 },
      info: { x: 1160, y: 812, width: 428, height: 176 },
    },

    titles: {
      shop: "SHOP",
      game: "DEFENSE",
      info: "FORTRESS INFO",
    },

    breakLabelTemplate: "Break {n}",

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
      width: 88,
      height: 54,
      gap: 8,
      startX: 32,
      startY: 870,
      columns: 7,
    },

    shopItems: [
      {
        id: "buildable_tile",
        label: "Build",
        fullName: "Buildable",
        icon: "⬚",
        description: "Create slot",
        category: "buildable",
      },
      {
        id: "gold_mine",
        label: "Gold",
        fullName: "Gold Mine",
        icon: "◆",
        description: "Gold income",
        category: "resource",
      },
      {
        id: "barracks",
        label: "Barracks",
        fullName: "Barracks",
        icon: "⚑",
        description: "Train troops",
        category: "military",
      },
      {
        id: "archer",
        label: "Archer",
        fullName: "Archer",
        icon: "➶",
        description: "Ranged unit",
        category: "unit",
      },
      {
        id: "cannon",
        label: "Cannon",
        fullName: "Cannon",
        icon: "◉",
        description: "Heavy defense",
        category: "tower",
      },
      {
        id: "wizard",
        label: "Wizard",
        fullName: "Wizard",
        icon: "✦",
        description: "Magic damage",
        category: "tower",
      },
      {
        id: "inferno_tower",
        label: "Inferno",
        fullName: "Inferno Tower",
        icon: "🔥",
        description: "Burning beam",
        category: "tower",
      },
    ],
  },
};


const game = new Game();

game.addLevel(new MenuLevel(game, Utils)); //0
game.addLevel(new HelpLevel(game, Utils)); //1
game.addLevel(new StoryLevel(game, Utils)); //2
game.addLevel(new GameLevel(game, Utils)); //3
game.loop();
