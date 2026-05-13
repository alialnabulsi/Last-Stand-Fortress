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

    //All data objects should be moved for util in index
    this.shopRules = {
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
    };

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
      state: "IDLE",
      preparationTimer: 120,
      breakTimer: 10,
      timerRunning: false,
      lastTickAt: 0,
      breaksUsed: 0,
      breaksAllowed: 3,
      enemyLevel: 1,
      enemyCount: 0,
      enemyHp: 1,
      enemySpeed: 1,
    };

    this.townHallState = {
      townHall: null,
      hp: 100,
      maxHp: 100,
    };

    this.shopButtons = [];
    this.controlButtons = [];
    this.townHallDestroyedHandled = false;

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
          cost:
            (this.shopRules[item.id] && this.shopRules[item.id].cost) || null,
          style,
        },
      );

      this.shopButtons.push(btn);
    }
  }

  createGameButtons() {
    const style = this.config.style;
    const gameBox = this.config.layout.game;

    this.startDefenseButton = new PanelButton(
      gameBox.x + 16,
      gameBox.y + 75,
      120,
      44,
      "START",
      () => {
        if (this.defenseState.state === "UNDER_ATTACK") {
          this.setMessage("Defense already started.");
          return;
        }

        if (this.defenseState.state === "BREAK") {
          this.setMessage("Cannot start while on break.");
          return;
        }

        this.defenseState.timerRunning = true;
        this.defenseState.state = "PREPARATION";
        this.defenseState.lastTickAt = performance.now();
        this.onPlanningStarted();
        this.updateEnemyInfo();
        this.setMessage("Preparation timer started.");
      },
      {
        icon: "⚔",
        description: "Start wave",
        style,
      },
    );

    this.takeBreakButton = new PanelButton(
      gameBox.x + 150,
      gameBox.y + 75,
      120,
      44,
      "TAKE BREAK",
      () => {
        if (this.defenseState.breaksUsed >= this.defenseState.breaksAllowed) {
          this.setMessage("No breaks left.");
          return;
        }

        this.defenseState.breaksUsed += 1;
        this.defenseState.state = "BREAK";
        this.defenseState.breakTimer = 10;
        this.defenseState.timerRunning = true;
        this.defenseState.lastTickAt = performance.now();
        this.onDefenseEnded({ townHallAlive: true });
        this.setMessage("Break activated.");
      },
      {
        icon: "☕",
        description: "Pause phase",
        style,
      },
    );

    this.controlButtons = [this.startDefenseButton, this.takeBreakButton];
  }

  selectShopItem(item) {
    const rule = this.shopRules[item.id];
    if (!rule) {
      this.setMessage("This item is not configured yet.");
      return;
    }

    if (this.shopState.selectedItemId === item.id) {
      this.clearSelection();
      this.setMessage("Selection cancelled.");
      return;
    }

    if (this.playerState.level < rule.unlockLevel) {
      this.setMessage(
        `${item.fullName} is locked. Unlocks at level ${rule.unlockLevel}.`,
      );
      return;
    }

    if (!this.canAfford(rule.cost)) {
      this.setMessage(
        `Not enough gold for ${item.fullName}. Need ${rule.cost}G.`,
      );
      return;
    }

    if (
      rule.troopCost &&
      this.armyState.currentTroops >= this.armyState.maxTroops
    ) {
      this.setMessage("Troop capacity is full.");
      return;
    }

    this.shopState.selectedItem = { ...item, ...rule };
    this.shopState.selectedItemId = item.id;
    this.setMessage(`${item.fullName} selected. Placement is not enabled yet.`);
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
    let didLevelUp = false;

    while (this.playerState.xp >= this.playerState.xpToNextLevel) {
      this.playerState.xp -= this.playerState.xpToNextLevel;
      this.playerState.level += 1;
      this.playerState.xpToNextLevel = Math.floor(
        this.playerState.xpToNextLevel * 1.2,
      );
      this.updateEnemyInfo();
      didLevelUp = true;
    }

    if (didLevelUp && this.game.currentGameLevel) {
      this.game.currentGameLevel.changeMapForPlayerLevel(
        this.playerState.level,
      );
    }
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
    const hasTownHallClass = typeof TownHall !== "undefined";
    for (let i = 0; i < arrayOfSprites.length; i++) {
      const sprite = arrayOfSprites[i];
      const isTownHallInstance = hasTownHallClass && sprite instanceof TownHall;

      if (sprite && (isTownHallInstance || sprite.isTownHall === true)) {
        this.townHallState.townHall = sprite;
        this.townHallState.hp = sprite.hp;
        this.townHallState.maxHp = sprite.maxHp;
        return sprite;
      }
    }

    this.townHallState.townHall = null;
    return null;
  }

  update(arrayOfSprites, keys, mouse) {
    if (!this.townHallState.townHall) this.findTownHall(arrayOfSprites);
    if (this.townHallState.townHall) {
      this.townHallState.hp = this.townHallState.townHall.hp;
      this.townHallState.maxHp = this.townHallState.townHall.maxHp;
      if (this.townHallState.hp <= 0 && !this.townHallDestroyedHandled) {
        this.townHallDestroyedHandled = true;
        this.onDefenseEnded({ townHallAlive: false });
      }
    }

    for (const btn of this.shopButtons) {
      const rule = this.shopRules[btn.item.id];
      const locked = rule ? this.playerState.level < rule.unlockLevel : true;
      const broke = rule ? !this.canAfford(rule.cost) : true;

      btn.selected = this.shopState.selectedItemId === btn.item.id;
      btn.disabled = locked || broke;
      btn.update(arrayOfSprites, keys, mouse);
    }

    this.updateDefenseTimer();

    this.startDefenseButton.disabled =
      this.defenseState.state === "UNDER_ATTACK";
    this.takeBreakButton.disabled =
      this.defenseState.breaksUsed >= this.defenseState.breaksAllowed;
    for (const btn of this.controlButtons)
      btn.update(arrayOfSprites, keys, mouse);

    return false;
  }

  updateDefenseTimer() {
    if (!this.defenseState.timerRunning) return;

    const now = performance.now();
    if (!this.defenseState.lastTickAt) this.defenseState.lastTickAt = now;
    const elapsedSeconds = (now - this.defenseState.lastTickAt) / 1000;
    this.defenseState.lastTickAt = now;

    if (this.defenseState.state === "PREPARATION") {
      this.defenseState.preparationTimer = Math.max(
        0,
        this.defenseState.preparationTimer - elapsedSeconds,
      );
      if (this.defenseState.preparationTimer === 0) {
        this.onPlanningEnded();
        this.defenseState.state = "UNDER_ATTACK";
        this.defenseState.timerRunning = false;
        this.onDefenseStarted();
        this.setMessage("Preparation ended. Under attack.");
      }
      return;
    }

    if (this.defenseState.state === "BREAK") {
      this.defenseState.breakTimer = Math.max(
        0,
        this.defenseState.breakTimer - elapsedSeconds,
      );
      if (this.defenseState.breakTimer === 0) {
        this.defenseState.state = "UNDER_ATTACK";
        this.defenseState.timerRunning = false;
        this.onDefenseStarted();
        this.setMessage("Break ended. Under attack.");
      }
    }
  }

  onPlanningStarted() {
  }

  onPlanningEnded() {
  }

  onDefenseStarted() {
  }

  onDefenseEnded({ townHallAlive = true } = {}) {
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
    const bg = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x,
      this.y + this.height,
    );
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
    if (ctx.roundRect)
      ctx.roundRect(section.x, section.y, section.width, section.height, 12);
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
    ctx.fillText(
      this.config.titles.shop,
      this.config.layout.shop.x + 15,
      this.config.layout.shop.y + 12,
    );
    ctx.fillText(
      this.config.titles.game,
      this.config.layout.game.x + 15,
      this.config.layout.game.y + 12,
    );
    ctx.fillText(
      this.config.titles.info,
      this.config.layout.info.x + 15,
      this.config.layout.info.y + 12,
    );
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
    ctx.fillText(
      "Select what you want to place on the map.",
      shop.x + 15,
      shop.y + 42,
    );

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

    ctx.fillText(
      `State: ${this.defenseState.state}`,
      gameBox.x + 20,
      gameBox.y + 45,
    );

    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;
    const activeTimer =
      this.defenseState.state === "BREAK"
        ? this.defenseState.breakTimer
        : this.defenseState.preparationTimer;
    ctx.fillText(
      `Timer: ${this.formatTimer(activeTimer)}`,
      gameBox.x + 20,
      gameBox.y + 130,
    );
    ctx.fillText(
      `Enemy Lvl: ${this.defenseState.enemyLevel}`,
      gameBox.x + 20,
      gameBox.y + 150,
    );
    ctx.fillText(
      `Enemy #: ${this.defenseState.enemyCount}`,
      gameBox.x + 150,
      gameBox.y + 130,
    );
    ctx.fillText(
      `Enemy HP: x${this.defenseState.enemyHp.toFixed(2)}`,
      gameBox.x + 150,
      gameBox.y + 150,
    );
    ctx.fillText(
      `Enemy Spd: x${this.defenseState.enemySpeed.toFixed(2)}`,
      gameBox.x + 20,
      gameBox.y + 168,
    );

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
    ctx.fillText(`Gold: ${this.playerState.gold}G`, info.x + 16, info.y + 44);
    ctx.fillText(`Level: ${this.playerState.level}`, info.x + 160, info.y + 44);
    ctx.fillText(
      `XP: ${this.playerState.xp}/${this.playerState.xpToNextLevel}`,
      info.x + 250,
      info.y + 44,
    );

    ctx.font = "14px Arial";
    ctx.fillStyle = style.mutedText;
    const selectedName = this.shopState.selectedItem
      ? this.shopState.selectedItem.fullName
      : "None";
    ctx.fillText(`Selected: ${selectedName}`, info.x + 16, info.y + 74);
    ctx.fillText(
      `Town Hall HP: ${this.townHallState.hp}/${this.townHallState.maxHp}`,
      info.x + 16,
      info.y + 96,
    );
    ctx.fillText(this.shopState.message, info.x + 16, info.y + 122);

    ctx.restore();
  }

  formatTimer(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    const m = Math.floor(value / 60);
    const s = value % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}
