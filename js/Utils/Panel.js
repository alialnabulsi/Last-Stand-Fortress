class Panel extends Sprite {
  constructor(game, utils) {
    super();

    this.game = game;
    this.utils = utils;
    this.db = utils.Panel;

    this.x = this.db.layout.x;
    this.y = this.db.layout.y;
    this.width = this.db.layout.width;
    this.height = this.db.layout.height;

    this.shopButtons = [];
    this.controlButtons = [];

    this.ensureGameState();
    this.createShopButtons();
    this.createGameButtons();
  }

  ensureGameState() {
    if (!this.game.selectedBuildItem) {
      this.game.selectedBuildItem = null;
    }

    if (!this.game.panelMessage) {
      this.game.panelMessage = this.db.messages.default;
    }

    if (!this.game.playerState) {
      this.game.playerState = { ...this.db.playerDefaults };
    }

    if (!this.game.defenseState) {
      this.game.defenseState = { ...this.db.defenseDefaults };
      this.updateEnemyInfo();
    }
  }

  createShopButtons() {
    this.shopButtons = [];

    const config = this.db.shopButton;
    const style = this.db.style;

    for (let i = 0; i < this.db.shopItems.length; i++) {
      const item = this.db.shopItems[i];

      const col = i % config.columns;
      const row = Math.floor(i / config.columns);

      const x = config.startX + col * (config.width + config.gap);
      const y = config.startY + row * (config.height + config.gap);

      const btn = new PanelButton(
        x,
        y,
        config.width,
        config.height,
        item.shortName || item.name,
        () => this.selectShopItem(item),
        {
          item,
          icon: item.icon,
          description: item.description,
          cost: item.cost,
          style,
        }
      );

      this.shopButtons.push(btn);
    }
  }

  createGameButtons() {
    const style = this.db.style;
    const gameBox = this.db.layout.game;

    this.startDefenseButton = new PanelButton(
      gameBox.x + 25,
      gameBox.y + 75,
      235,
      44,
      "START DEFENSE",
      () => this.startDefense(),
      {
        icon: "⚔",
        description: "Begin enemy attack",
        style,
      }
    );

    this.controlButtons = [this.startDefenseButton];
  }

  selectShopItem(item) {
    const player = this.game.playerState;

    if (player.level < item.levelRequired) {
      this.game.panelMessage = `${item.name} unlocks at level ${item.levelRequired}.`;
      return;
    }

    if (player.gold < item.cost) {
      this.game.panelMessage = `${this.db.messages.notEnoughGold} Need ${item.cost}G.`;
      return;
    }

    if (this.game.selectedBuildItem && this.game.selectedBuildItem.id === item.id) {
      this.game.selectedBuildItem = null;
      this.game.panelMessage = this.db.messages.cancelled;
      return;
    }

    this.game.selectedBuildItem = item;
    this.game.panelMessage = `${item.name} selected. ${this.db.messages.selected}`;
  }

  startDefense() {
    const defense = this.game.defenseState;

    if (defense.started) {
      this.game.panelMessage = this.db.messages.defenseAlreadyStarted;
      return;
    }

    defense.started = true;
    defense.phase = "DEFENDING";
    defense.timer = 0;

    this.updateEnemyInfo();

    this.game.panelMessage = this.db.messages.defenseStarted;
  }

  updateEnemyInfo() {
    const player = this.game.playerState;
    const defense = this.game.defenseState;
    const scaling = this.db.enemyScaling;

    const level = player.level;

    defense.enemyLevel = level;

    defense.enemiesRemaining =
      scaling.baseEnemyCount + (level - 1) * scaling.extraEnemiesPerLevel;

    defense.enemyHpMultiplier =
      scaling.baseEnemyHpMultiplier + (level - 1) * scaling.hpMultiplierPerLevel;

    defense.enemySpeedMultiplier =
      scaling.baseEnemySpeedMultiplier + (level - 1) * scaling.speedMultiplierPerLevel;
  }

  update(arrayOfSprites, keys, mouse) {
    this.ensureGameState();

    const player = this.game.playerState;
    const defense = this.game.defenseState;

    if (!defense.started && defense.timer > 0) {
      // Later we can connect real delta time.
      // For now this is only panel state.
    }

    for (const btn of this.shopButtons) {
      const item = btn.item;

      btn.disabled =
        player.level < item.levelRequired ||
        player.gold < item.cost;

      btn.selected =
        !!this.game.selectedBuildItem &&
        this.game.selectedBuildItem.id === item.id;

      btn.update(arrayOfSprites, keys, mouse);
    }

    this.startDefenseButton.disabled = defense.started;

    for (const btn of this.controlButtons) {
      btn.update(arrayOfSprites, keys, mouse);
    }

    return false;
  }

  draw(ctx) {
    this.drawPanelBackground(ctx);
    this.drawSectionTitles(ctx);
    this.drawShop(ctx);
    this.drawDefenseSection(ctx);
    this.drawInfoSection(ctx);
  }

  drawPanelBackground(ctx) {
    const style = this.db.style;

    ctx.save();

    const bg = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    bg.addColorStop(0, style.panelTop);
    bg.addColorStop(0.5, style.panelMiddle);
    bg.addColorStop(1, style.panelBottom);

    ctx.fillStyle = bg;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    ctx.strokeStyle = style.border;
    ctx.lineWidth = 4;
    ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);

    this.drawSectionBox(ctx, this.db.layout.shop);
    this.drawSectionBox(ctx, this.db.layout.game);
    this.drawSectionBox(ctx, this.db.layout.info);

    ctx.restore();
  }

  drawSectionBox(ctx, section) {
    const style = this.db.style;

    ctx.save();

    ctx.fillStyle = style.sectionFill;
    ctx.strokeStyle = style.sectionBorder;
    ctx.lineWidth = 2;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(section.x, section.y, section.width, section.height, 12);
    } else {
      ctx.rect(section.x, section.y, section.width, section.height);
    }

    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  drawSectionTitles(ctx) {
    const style = this.db.style;

    ctx.save();

    ctx.font = "bold 22px Arial";
    ctx.fillStyle = style.titleColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.fillText(this.db.layout.shop.title, this.db.layout.shop.x + 15, this.db.layout.shop.y + 12);
    ctx.fillText(this.db.layout.game.title, this.db.layout.game.x + 15, this.db.layout.game.y + 12);
    ctx.fillText(this.db.layout.info.title, this.db.layout.info.x + 15, this.db.layout.info.y + 12);

    ctx.restore();
  }

  drawShop(ctx) {
    const shop = this.db.layout.shop;
    const style = this.db.style;

    ctx.save();

    ctx.font = "13px Arial";
    ctx.fillStyle = style.mutedText;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Select what you want to place on the map.", shop.x + 15, shop.y + 42);

    for (const btn of this.shopButtons) {
      btn.draw(ctx);
    }

    ctx.restore();
  }

  drawDefenseSection(ctx) {
    const defense = this.game.defenseState;
    const gameBox = this.db.layout.game;
    const style = this.db.style;

    ctx.save();

    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 15px Arial";
    ctx.fillStyle = style.textColor;

    ctx.fillText(`State: ${defense.phase}`, gameBox.x + 20, gameBox.y + 45);

    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;

    ctx.fillText(`Prep Timer: ${this.formatTimer(defense.timer)}`, gameBox.x + 20, gameBox.y + 130);
    ctx.fillText(`Enemy Level: ${defense.enemyLevel}`, gameBox.x + 20, gameBox.y + 150);

    ctx.fillText(`Enemies: ${defense.enemiesRemaining}`, gameBox.x + 150, gameBox.y + 130);
    ctx.fillText(`HP x${defense.enemyHpMultiplier.toFixed(2)}`, gameBox.x + 150, gameBox.y + 150);

    for (const btn of this.controlButtons) {
      btn.draw(ctx);
    }

    ctx.restore();
  }

  drawInfoSection(ctx) {
    const player = this.game.playerState;
    const selected = this.game.selectedBuildItem;
    const info = this.db.layout.info;
    const style = this.db.style;

    ctx.save();

    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.font = "bold 18px Arial";
    ctx.fillStyle = style.textColor;

    ctx.fillText(`Gold: ${player.gold}`, info.x + 15, info.y + 45);
    ctx.fillText(`Level: ${player.level}`, info.x + 160, info.y + 45);

    this.drawBar(
      ctx,
      info.x + 15,
      info.y + 75,
      380,
      18,
      player.xp,
      player.xpToNextLevel,
      "XP",
      "#4c8cff"
    );

    this.drawBar(
      ctx,
      info.x + 15,
      info.y + 105,
      380,
      18,
      player.fortressHp,
      player.fortressMaxHp,
      "HP",
      "#d44535"
    );

    ctx.font = "bold 15px Arial";
    ctx.fillStyle = style.titleColor;
    ctx.fillText("Selected:", info.x + 15, info.y + 135);

    ctx.font = "14px Arial";
    ctx.fillStyle = style.textColor;

    const selectedText = selected
      ? `${selected.name} (${selected.cost}G)`
      : "Nothing";

    ctx.fillText(selectedText, info.x + 95, info.y + 135);

    ctx.font = "13px Arial";
    ctx.fillStyle = style.mutedText;
    ctx.fillText(this.game.panelMessage || "", info.x + 15, info.y + 158);

    ctx.restore();
  }

  drawBar(ctx, x, y, width, height, value, max, label, color) {
    const percent = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;

    ctx.save();

    ctx.fillStyle = "#090909";
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = color;
    ctx.fillRect(x, y, width * percent, height);

    ctx.strokeStyle = "#c8a24a";
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);

    ctx.font = "bold 12px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${label}: ${value} / ${max}`, x + width / 2, y + height / 2);

    ctx.restore();
  }

  formatTimer(seconds) {
    const total = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(total / 60).toString().padStart(2, "0");
    const secs = (total % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }
}