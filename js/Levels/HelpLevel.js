class HelpLevel extends Level {
  constructor(game, utils) {
    super();
    this.game = game;
    this.MenuBackgroundImage = utils.BackgroundImages.MenuLevelBackground;
    this.backButtonTitle = utils.LevelsTexts.MenuLevel.backButtonTitle;
  }

  initialize() {
    this.game.addSprite(new Background(this.MenuBackgroundImage));

    this.game.addSprite(
      new Text(800, 115, "How to Play", {
        color: "#e8d174",
        font: "bold 58px Georgia",
        shadow: true,
        stroke: true,
      }),
    );

    const helpLines = [
      "Objective: defend your Town Hall from every enemy wave.",
      "Start by placing Buildable tiles on grass where you want to construct.",
      "Towers, buildings, and mines can only be placed on Buildable tiles.",
      "Waves begin after the build phase and get stronger as levels progress.",
      "Protect the Town Hall at all costs. If it falls, you lose the game.",
      "Win by surviving the waves and clearing each map level.",
    ];

    for (let i = 0; i < helpLines.length; i++) {
      this.game.addSprite(
        new Text(190, 220 + i * 88, helpLines[i], {
          color: "#f7f6f2",
          font: "29px Georgia",
          align: "left",
          baseline: "middle",
          maxWidth: 1220,
          shadow: true,
          stroke: true,
        }),
      );
    }

    this.game.addSprite(
      new Button(100, 800, 300, 56, this.backButtonTitle, () => {
        this.game.changeLevel(0);
      }),
    );
  }
}
