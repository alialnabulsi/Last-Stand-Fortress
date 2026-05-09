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

    this.playerState = {
      gold: 250,
      xp: 0,
      level: 1,
      xpToNextLevel: 100,
    };

    this.shopState = {
      selectedItem: null,
      selectedItemId: null,
      message: "Select something from the shop.",
    };

    this.economyState = {
      goldRate: 0,
      goldMineCount: 0,
    };

    this.armyState = {
      barracksCount: 0,
      currentTroops: 0,
      maxTroops: 0,
    };

    this.defenseState = {
      state: "PREPARATION",
      preparationTimer: 30,
      breakTimer: 10,
      breaksUsed: 0,
      breaksAllowed: 3,
      enemyLevel: 1,
      enemyCount: 0,
      enemyHp: 1,
      enemySpeed: 1,
    };

    this.townHallState = {
      townHall: null,
      hp: 0,
      maxHp: 0,
    };

    this.shopButtons = [];
    this.controlButtons = [];

    this.createShopButtons();
    this.createGameButtons();
    this.updateEnemyInfo();
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

      const btn = new PanelButton(
        x,
        y,
        config.width,
        config.height,
        item.label,
        () => this.selectShopItem(item),
        {
          item,
          icon: item.icon,
          description: item.description,
          style,
        }
      );

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
      () => {
        this.defenseState.state = "DEFENDING";
        this.updateEnemyInfo();
        this.setMessage("Defense started. Prepare for enemies.");
      },
      {
        icon: "⚔",
        description: "Begin enemy attack",
        style,
      }
    );

    this.controlButtons = [this.startDefenseButton];
  }

  selectShopItem(item) {
    if (this.shopState.selectedItemId === item.id) {
      this.clearSelection();
      this.setMessage("Selection cancelled.");
      return;
    }

    this.shopState.selectedItem = item;
    this.shopState.selectedItemId = item.id;
    this.setMessage(`${item.fullName} selected. Click a valid tile on the map.`);
  }

  clearSelection() {
    this.shopState.selectedItem = null;
    this.shopState.selectedItemId = null;
  }

  canAfford(cost) {
    return this.playerState.gold >= cost;
  }

  spendGold(amount) {
    if (!this.canAfford(amount)) return false;
    this.playerState.gold -= amount;
    return true;
  }

  addGold(amount) {
    this.playerState.gold += Math.max(0, amount);
  }

  addXP(amount) {
    this.playerState.xp += Math.max(0, amount);
    this.levelUpIfNeeded();
  }

  levelUpIfNeeded() {
    while (this.playerState.xp >= this.playerState.xpToNextLevel) {
      this.playerState.xp -= this.playerState.xpToNextLevel;
      this.playerState.level += 1;
      this.playerState.xpToNextLevel = Math.floor(this.playerState.xpToNextLevel * 1.2);
      this.updateEnemyInfo();
    }
  }

  addGoldMine() {
    this.economyState.goldMineCount += 1;
    this.economyState.goldRate = this.economyState.goldMineCount;
  }

  addBarracks() {
    this.armyState.barracksCount += 1;
    this.armyState.maxTroops = this.armyState.barracksCount * 5;
  }

  increaseTroopCount(amount) {
    this.armyState.currentTroops += Math.max(0, amount);
    if (this.armyState.currentTroops > this.armyState.maxTroops) {
      this.armyState.currentTroops = this.armyState.maxTroops;
    }
  }

  decreaseTroopCount(amount) {
    this.armyState.currentTroops -= Math.max(0, amount);
    if (this.armyState.currentTroops < 0) this.armyState.currentTroops = 0;
  }

  updateEnemyInfo() {
    const level = this.playerState.level;
    this.defenseState.enemyLevel = level;
    this.defenseState.enemyCount = 5 + (level - 1) * 2;
    this.defenseState.enemyHp = 1 + (level - 1) * 0.18;
    this.defenseState.enemySpeed = 1 + (level - 1) * 0.08;
  }

  setMessage(message) {
    this.shopState.message = message;
  }

  findTownHall(arrayOfSprites) {
    for (let i = 0; i < arrayOfSprites.length; i++) {
      const sprite = arrayOfSprites[i];
      if (sprite && sprite.isTownHall) {
        this.townHallState.townHall = sprite;
        this.townHallState.hp = sprite.hp;
        this.townHallState.maxHp = sprite.maxHp;
        return sprite;
      }
    }

    return null;
  }

  update(arrayOfSprites, keys, mouse) {
    if (!this.townHallState.townHall) this.findTownHall(arrayOfSprites);
    if (this.townHallState.townHall) {
      this.townHallState.hp = this.townHallState.townHall.hp;
      this.townHallState.maxHp = this.townHallState.townHall.maxHp;
    }

    for (const btn of this.shopButtons) {
      btn.selected = this.shopState.selectedItemId === btn.item.id;
      btn.disabled = false;
      btn.update(arrayOfSprites, keys, mouse);
    }

    this.startDefenseButton.disabled = this.defenseState.state === "DEFENDING";
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

  drawPanelBackground(ctx) { const style = this.config.style; ctx.save(); const bg = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height); bg.addColorStop(0, style.panelTop); bg.addColorStop(0.5, style.panelMiddle); bg.addColorStop(1, style.panelBottom); ctx.fillStyle = bg; ctx.fillRect(this.x, this.y, this.width, this.height); ctx.strokeStyle = style.border; ctx.lineWidth = 4; ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4); this.drawSectionBox(ctx, this.config.layout.shop); this.drawSectionBox(ctx, this.config.layout.game); this.drawSectionBox(ctx, this.config.layout.info); ctx.restore(); }
  drawSectionBox(ctx, section) { const style = this.config.style; ctx.save(); ctx.fillStyle = style.sectionFill; ctx.strokeStyle = style.sectionBorder; ctx.lineWidth = 2; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(section.x, section.y, section.width, section.height, 12); else ctx.rect(section.x, section.y, section.width, section.height); ctx.fill(); ctx.stroke(); ctx.restore(); }
  drawSectionTitles(ctx) { const style = this.config.style; ctx.save(); ctx.font = "bold 22px Arial"; ctx.fillStyle = style.titleColor; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText(this.config.titles.shop, this.config.layout.shop.x + 15, this.config.layout.shop.y + 12); ctx.fillText(this.config.titles.game, this.config.layout.game.x + 15, this.config.layout.game.y + 12); ctx.fillText(this.config.titles.info, this.config.layout.info.x + 15, this.config.layout.info.y + 12); ctx.restore(); }

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

    ctx.fillText(`State: ${this.defenseState.state}`, gameBox.x + 20, gameBox.y + 45);

    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;
    ctx.fillText(`Prep: ${this.formatTimer(this.defenseState.preparationTimer)}`, gameBox.x + 20, gameBox.y + 130);
    ctx.fillText(`Enemy Lvl: ${this.defenseState.enemyLevel}`, gameBox.x + 20, gameBox.y + 150);
    ctx.fillText(`Enemies: ${this.defenseState.enemyCount}`, gameBox.x + 150, gameBox.y + 130);
    ctx.fillText(`HP x${this.defenseState.enemyHp.toFixed(2)}`, gameBox.x + 150, gameBox.y + 150);

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
    ctx.fillText(`Level: ${this.playerState.level}`, info.x + 16, info.y + 44);
    ctx.fillText(`Gold: ${this.playerState.gold}G`, info.x + 170, info.y + 44);

    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;
    const selectedName = this.shopState.selectedItem ? this.shopState.selectedItem.fullName : "None";
    ctx.fillText(`Selected: ${selectedName}`, info.x + 16, info.y + 74);
    ctx.fillText(this.shopState.message, info.x + 16, info.y + 102);

    if (this.townHallState.maxHp > 0) {
      ctx.fillText(`Town Hall: ${this.townHallState.hp}/${this.townHallState.maxHp}`, info.x + 16, info.y + 126);
    }

    ctx.restore();
  }

  formatTimer(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    const m = Math.floor(value / 60);
    const s = value % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}
