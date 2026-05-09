class Panel extends Sprite {
  constructor(game, utils) {
    super();

    this.game = game;
    this.utils = utils;
    this.config = utils.Panel;

    this.x = this.config.layout.x;
    this.y = this.config.layout.y;
    this.width = this.config.layout.width;
    this.height = this.config.layout.height;

    // Live panel/gameplay data belongs to this Panel instance.
    this.selectedShopItem = null;
    this.message = "Select something from the shop.";

    this.player = {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      gold: 250,
    };

    this.defense = {
      phase: "PREPARATION",
      timer: 30,
      started: false,
      enemyLevel: 1,
      enemiesRemaining: 0,
      enemyHpMultiplier: 1,
      enemySpeedMultiplier: 1,
    };

    this.shopButtons = [];
    this.controlButtons = [];

    this.createShopButtons();
    this.createGameButtons();
  }

  createShopButtons() {
    this.shopButtons = [];
    const config = this.config.shopButton;
    const style = this.config.style;

    for (let i = 0; i < this.config.shopItems.length; i++) {
      const item = this.config.shopItems[i];
      const col = i % config.columns;
      const row = Math.floor(i / config.columns);

      const x = config.startX + col * (config.width + config.gap);
      const y = config.startY + row * (config.height + config.gap);

      const btn = new PanelButton(x, y, config.width, config.height, item.label, () => this.selectShopItem(item), {
        item,
        icon: item.icon,
        description: item.description,
        style,
      });

      this.shopButtons.push(btn);
    }
  }

  createGameButtons() {
    const style = this.config.style;
    const gameBox = this.config.layout.game;

    this.startDefenseButton = new PanelButton(
      gameBox.x + 25,
      gameBox.y + 75,
      235,
      44,
      "START DEFENSE",
      () => this.startDefense(),
      { icon: "⚔", description: "Begin enemy attack", style }
    );

    this.controlButtons = [this.startDefenseButton];
  }

  selectShopItem(item) {
    if (this.selectedShopItem && this.selectedShopItem.id === item.id) {
      this.selectedShopItem = null;
      this.message = "Selection cancelled.";
      return;
    }

    this.selectedShopItem = item;
    this.message = `${item.fullName} selected. Click a valid tile on the map.`;
  }

  startDefense() {
    if (this.defense.started) {
      this.message = "Defense is already running.";
      return;
    }

    this.defense.started = true;
    this.defense.phase = "DEFENDING";
    this.defense.timer = 0;
    this.message = "Defense started. Prepare for enemies.";
  }

  update(arrayOfSprites, keys, mouse) {
    this.defense.enemyLevel = this.player.level;

    for (const btn of this.shopButtons) {
      btn.selected = !!this.selectedShopItem && this.selectedShopItem.id === btn.item.id;
      btn.disabled = false;
      btn.update(arrayOfSprites, keys, mouse);
    }

    this.startDefenseButton.disabled = this.defense.started;
    for (const btn of this.controlButtons) btn.update(arrayOfSprites, keys, mouse);

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
    const style = this.config.style;
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

    this.drawSectionBox(ctx, this.config.layout.shop);
    this.drawSectionBox(ctx, this.config.layout.game);
    this.drawSectionBox(ctx, this.config.layout.info);

    ctx.restore();
  }

  drawSectionBox(ctx, section) {
    const style = this.config.style;
    ctx.save();
    ctx.fillStyle = style.sectionFill;
    ctx.strokeStyle = style.sectionBorder;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(section.x, section.y, section.width, section.height, 12);
    else ctx.rect(section.x, section.y, section.width, section.height);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  drawSectionTitles(ctx) {
    const style = this.config.style;
    ctx.save();
    ctx.font = "bold 22px Arial";
    ctx.fillStyle = style.titleColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(this.config.titles.shop, this.config.layout.shop.x + 15, this.config.layout.shop.y + 12);
    ctx.fillText(this.config.titles.game, this.config.layout.game.x + 15, this.config.layout.game.y + 12);
    ctx.fillText(this.config.titles.info, this.config.layout.info.x + 15, this.config.layout.info.y + 12);
    ctx.restore();
  }

  drawShop(ctx) {
    const shop = this.config.layout.shop;
    const style = this.config.style;
    ctx.save();
    ctx.font = "13px Arial";
    ctx.fillStyle = style.mutedText;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Select what you want to place on the map.", shop.x + 15, shop.y + 42);
    for (const btn of this.shopButtons) btn.draw(ctx);
    ctx.restore();
  }

  drawDefenseSection(ctx) {
    const gameBox = this.config.layout.game;
    const style = this.config.style;
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 15px Arial";
    ctx.fillStyle = style.textColor;
    ctx.fillText(`State: ${this.defense.phase}`, gameBox.x + 20, gameBox.y + 45);
    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;
    ctx.fillText(`Prep Timer: ${this.formatTimer(this.defense.timer)}`, gameBox.x + 20, gameBox.y + 130);
    ctx.fillText(`Enemy Level: ${this.defense.enemyLevel}`, gameBox.x + 20, gameBox.y + 150);
    ctx.fillText(`Enemies: ${this.defense.enemiesRemaining}`, gameBox.x + 150, gameBox.y + 130);
    ctx.fillText(`HP x${this.defense.enemyHpMultiplier.toFixed(2)}`, gameBox.x + 150, gameBox.y + 150);
    for (const btn of this.controlButtons) btn.draw(ctx);
    ctx.restore();
  }

  drawInfoSection(ctx) {
    const style = this.config.style;
    const info = this.config.layout.info;
    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 15px Arial";
    ctx.fillStyle = style.textColor;
    ctx.fillText(`Level: ${this.player.level}`, info.x + 16, info.y + 44);
    ctx.fillText(`Gold: ${this.player.gold}G`, info.x + 170, info.y + 44);
    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;
    const name = this.selectedShopItem ? this.selectedShopItem.fullName : "None";
    ctx.fillText(`Selected: ${name}`, info.x + 16, info.y + 74);
    ctx.fillText(this.message, info.x + 16, info.y + 102);
    ctx.restore();
  }

  formatTimer(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    const m = Math.floor(value / 60);
    const s = value % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}
