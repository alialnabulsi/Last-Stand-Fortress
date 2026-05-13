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

  // ===============================
  // ===============================
  // PANEL STATIC CONFIG (UI ONLY)
  // ===============================
  Panel: {
    defenseStates: {
      idle: "IDLE",
      preparation: "PREPARATION",
      underAttack: "UNDER_ATTACK",
      break: "BREAK",
    },
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
    labels: {
      shopHint: "Select what you want to place on the map.",
      state: "State",
      timer: "Timer",
      enemyLevel: "Enemy Lvl",
      remainingEnemies: "Enemy #",
      enemyHp: "Enemy HP",
      enemySpeed: "Enemy Spd",
      gold: "Gold",
      level: "Level",
      xp: "XP",
      selected: "Selected",
      townHallHp: "Town Hall HP",
      noSelection: "None",
    },
    messages: {
      default: "Select something from the shop.",
      itemNotConfigured: "This item is not configured yet.",
      selectionCancelled: "Selection cancelled.",
      lockedAtLevel: "{name} is locked. Unlocks at level {level}.",
      notEnoughGold: "Not enough gold for {name}. Need {cost}G.",
      troopCapacityFull: "Troop capacity is full.",
      selected: "{name} selected. Placement is not enabled yet.",
      defenseAlreadyStarted: "Defense already started.",
      cannotStartOnBreak: "Cannot start while on break.",
      preparationStarted: "Preparation timer started.",
      noBreaksLeft: "No breaks left.",
      breakActivated: "Break activated.",
      breakStopped: "Break stopped. Returning to {state}.",
      preparationEnded: "Preparation ended. Under attack.",
      breakEnded: "Break ended. Under attack.",
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
      {
        id: "buildable_tile",
        label: "Build",
        fullName: "Build Tile",
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
    shopRules: {
      buildable_tile: { cost: 25, unlockLevel: 1, placement: "grass" },
      gold_mine: {
        cost: 100,
        unlockLevel: 1,
        placement: "buildable",
        goldRateBonus: 1,
      },
      barracks: {
        cost: 150,
        unlockLevel: 1,
        placement: "buildable",
        troopCapacityBonus: 10,
      },
      archer: {
        cost: 80,
        unlockLevel: 1,
        placement: "buildable",
        troopCost: 1,
      },
      cannon: {
        cost: 120,
        unlockLevel: 2,
        placement: "buildable",
        troopCost: 2,
      },
      wizard: {
        cost: 180,
        unlockLevel: 3,
        placement: "buildable",
        troopCost: 2,
      },
      inferno_tower: {
        cost: 260,
        unlockLevel: 4,
        placement: "buildable",
        troopCost: 3,
      },
    },
    runtimeDefaults: {
      gold: 250,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      preparationDurationSeconds: 120,
      breakDurationSeconds: 10,
      breaksAllowed: 3,
      townHallHp: 100,
      townHallMaxHp: 100,
    },
  },
};

const game = new Game();

Utils.MAP.map_2 = Utils.MAP.map_2 || Utils.MAP.map_1;
Utils.MAP.map_3 = Utils.MAP.map_3 || Utils.MAP.map_1;
Utils.MAP.map_4 = Utils.MAP.map_4 || Utils.MAP.map_1;

game.addLevel(new MenuLevel(game, Utils)); //0
game.addLevel(new HelpLevel(game, Utils)); //1
game.addLevel(new StoryLevel(game, Utils)); //2
game.addLevel(new GameLevel(game, Utils)); //3
game.loop();
