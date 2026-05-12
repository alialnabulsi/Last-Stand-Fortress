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

    this.shopRules = this.config.shopRules || {};

    const defaults = this.config.runtimeDefaults || {};
    const defenseStates = this.config.defenseStates;

    this.playerState = {
      gold: defaults.gold ?? 250,
      xp: defaults.xp ?? 0,
      level: defaults.level ?? 1,
      xpToNextLevel: defaults.xpToNextLevel ?? 100,
    };

    this.shopState = {
      selectedItem: null,
      selectedItemId: null,
      unlockedItemIds: [],
      message: this.config.messages.default,
    };

    this.economyState = { goldRate: 0, goldMineCount: 0 };
    this.armyState = { barracksCount: 0, currentTroops: 0, maxTroops: 0 };

    this.defenseState = {
      state: defenseStates.idle,
      previousState: null,
      preparationDurationSeconds: defaults.preparationDurationSeconds ?? 120,
      breakDurationSeconds: defaults.breakDurationSeconds ?? 10,
      preparationTimer: 0,
      breakTimer: 0,
      timerRunning: false,
      lastTickAt: 0,
      breaksUsed: 0,
      breaksAllowed: defaults.breaksAllowed ?? 3,
      enemyLevel: 1,
      enemyCount: 0,
      enemyHp: 1,
      enemySpeed: 1,
    };

    this.townHallState = {
      townHall: null,
      // TODO: Replace this static value by reading from the correct sprite/object when that system is implemented.
      hp: defaults.townHallHp ?? 100,
      // TODO: Replace this static value by reading from the correct sprite/object when that system is implemented.
      maxHp: defaults.townHallMaxHp ?? 100,
    };

    this.shopButtons = [];
    this.controlButtons = [];
    this.townHallDestroyedHandled = false;

    this.createShopButtons();
    this.createGameButtons();
    this.updateUnlockedShopItems();
    this.updateEnemyInfo();
  }

  formatMessage(template, values = {}) {
    return String(template || "").replace(/\{(\w+)\}/g, (_, key) =>
      values[key] !== undefined ? values[key] : `{${key}}`,
    );
  }

  createShopButtons() {
    this.shopButtons = [];
    const config = this.config.shopButton;
    const style = this.config.style;
    const shopBox = this.config.layout.shop;
    const innerPadding = 16;
    const titleAndHintHeight = 52;

    for (let i = 0; i < this.config.shopItems.length; i++) {
      const item = this.config.shopItems[i];
      const col = i % config.columns;
      const row = Math.floor(i / config.columns);
      const x = shopBox.x + innerPadding + col * (config.width + config.gap);
      const y = shopBox.y + titleAndHintHeight + row * (config.height + config.gap);

      const btn = new PanelButton(x, y, config.width, config.height, item.label, () => this.selectShopItem(item), {
        item,
        icon: item.icon,
        description: item.description,
        cost: (this.shopRules[item.id] && this.shopRules[item.id].cost) || null,
        style,
      });
      this.shopButtons.push(btn);
    }
  }

  createGameButtons() {
    const style = this.config.style;
    const gameBox = this.config.layout.game;

    this.startDefenseButton = new PanelButton(gameBox.x + 16, gameBox.y + 75, 120, 44, "START", () => this.startPreparation(), { icon: "⚔", description: "Start wave", style });

    this.takeBreakButton = new PanelButton(gameBox.x + 150, gameBox.y + 75, 120, 44, "BREAK", () => this.toggleBreak(), { icon: "☕", description: "Pause phase", style });

    this.controlButtons = [this.startDefenseButton, this.takeBreakButton];
  }

  startPreparation() {
    const states = this.config.defenseStates;
    if (this.defenseState.state === states.underAttack || this.defenseState.state === states.break) return;
    this.setDefenseState(states.preparation);
    this.defenseState.preparationTimer = this.defenseState.preparationDurationSeconds;
    this.setMessage(this.config.messages.preparationStarted);
  }

  toggleBreak() {
    const states = this.config.defenseStates;
    const current = this.defenseState.state;

    if (current === states.break) {
      const returnState = this.defenseState.previousState || states.idle;
      this.setDefenseState(returnState);
      this.defenseState.breakTimer = 0;
      this.setMessage(this.formatMessage(this.config.messages.breakStopped, { state: returnState }));
      return;
    }

    const canUseBreak = current === states.preparation || current === states.underAttack;
    if (!canUseBreak) return;
    if (this.defenseState.breaksUsed >= this.defenseState.breaksAllowed) {
      this.setMessage(this.config.messages.noBreaksLeft);
      return;
    }

    this.defenseState.breaksUsed += 1;
    this.defenseState.previousState = current;
    this.setDefenseState(states.break);
    this.defenseState.breakTimer = this.defenseState.breakDurationSeconds;
    this.setMessage(this.config.messages.breakActivated);
  }

  setDefenseState(state) {
    const states = this.config.defenseStates;
    this.defenseState.state = state;
    this.defenseState.lastTickAt = performance.now();
    const timerState = state === states.preparation || state === states.break;
    this.defenseState.timerRunning = timerState;
    if (state === states.idle || state === states.underAttack) {
      this.defenseState.preparationTimer = 0;
      if (state !== states.break) this.defenseState.breakTimer = 0;
    }
  }

  selectShopItem(item) {
    const rule = this.shopRules[item.id];
    if (!rule) return this.setMessage(this.config.messages.itemNotConfigured);
    if (this.shopState.selectedItemId === item.id) {
      this.clearSelection();
      return this.setMessage(this.config.messages.selectionCancelled);
    }
    if (!this.shopState.unlockedItemIds.includes(item.id)) {
      return this.setMessage(this.formatMessage(this.config.messages.lockedAtLevel, { name: item.fullName, level: rule.unlockLevel }));
    }
    if (!this.canAfford(rule.cost)) {
      return this.setMessage(this.formatMessage(this.config.messages.notEnoughGold, { name: item.fullName, cost: rule.cost }));
    }

    this.shopState.selectedItem = { ...item, ...rule };
    this.shopState.selectedItemId = item.id;
    this.setMessage(this.formatMessage(this.config.messages.selected, { name: item.fullName }));
  }

  updateUnlockedShopItems() {
    this.shopState.unlockedItemIds = this.config.shopItems
      .filter((item) => {
        const rule = this.shopRules[item.id];
        return rule && this.playerState.level >= rule.unlockLevel;
      })
      .map((item) => item.id);
  }

  clearSelection() { this.shopState.selectedItem = null; this.shopState.selectedItemId = null; }
  canAfford(cost) { return this.playerState.gold >= cost; }
  spendGold(amount) { if (!this.canAfford(amount)) return false; this.playerState.gold -= amount; return true; }
  addGold(amount) { this.playerState.gold += Math.max(0, amount); }

  addXP(amount) { this.playerState.xp += Math.max(0, amount); this.levelUpIfNeeded(); }

  levelUpIfNeeded() {
    let didLevelUp = false;
    while (this.playerState.xp >= this.playerState.xpToNextLevel) {
      this.playerState.xp -= this.playerState.xpToNextLevel;
      this.playerState.level += 1;
      this.playerState.xpToNextLevel = Math.floor(this.playerState.xpToNextLevel * 1.2);
      didLevelUp = true;
    }
    if (!didLevelUp) return;
    this.updateUnlockedShopItems();
    this.updateEnemyInfo();
    if (this.game.currentGameLevel) this.game.currentGameLevel.changeMapForPlayerLevel(this.playerState.level);
  }

  setEnemyInfo({ enemyLevel, enemyCount, enemyHp, enemySpeed }) {
    if (typeof enemyLevel === "number") this.defenseState.enemyLevel = enemyLevel;
    if (typeof enemyCount === "number") this.defenseState.enemyCount = enemyCount;
    if (typeof enemyHp === "number") this.defenseState.enemyHp = enemyHp;
    if (typeof enemySpeed === "number") this.defenseState.enemySpeed = enemySpeed;
  }

  updateEnemyInfo() {
    const level = this.playerState.level;
    // TODO: Replace this static value by reading from the correct sprite/object when that system is implemented.
    this.setEnemyInfo({
      enemyLevel: level,
      enemyCount: 5 + (level - 1) * 2,
      enemyHp: 1 + (level - 1) * 0.18,
      enemySpeed: 1 + (level - 1) * 0.08,
    });
  }

  updateTownHallInfo({ hp, maxHp }) {
    if (typeof hp === "number") this.townHallState.hp = hp;
    if (typeof maxHp === "number") this.townHallState.maxHp = maxHp;
  }

  setMessage(message) { this.shopState.message = message; }

  findTownHall(arrayOfSprites) {
    const hasTownHallClass = typeof TownHall !== "undefined";
    for (const sprite of arrayOfSprites) {
      const isTownHallInstance = hasTownHallClass && sprite instanceof TownHall;
      if (sprite && (isTownHallInstance || sprite.isTownHall === true)) {
        this.townHallState.townHall = sprite;
        this.updateTownHallInfo({ hp: sprite.hp, maxHp: sprite.maxHp });
        return sprite;
      }
    }
    this.townHallState.townHall = null;
    return null;
  }

  update(arrayOfSprites, keys, mouse) {
    if (!this.townHallState.townHall) this.findTownHall(arrayOfSprites);
    if (this.townHallState.townHall) this.updateTownHallInfo({ hp: this.townHallState.townHall.hp, maxHp: this.townHallState.townHall.maxHp });

    for (const btn of this.shopButtons) {
      const rule = this.shopRules[btn.item.id];
      const locked = !this.shopState.unlockedItemIds.includes(btn.item.id);
      const broke = rule ? !this.canAfford(rule.cost) : true;
      btn.selected = this.shopState.selectedItemId === btn.item.id;
      btn.disabled = locked || broke;
      btn.update(arrayOfSprites, keys, mouse);
    }

    this.updateDefenseTimer();
    const states = this.config.defenseStates;
    this.startDefenseButton.disabled = this.defenseState.state !== states.idle;
    this.takeBreakButton.disabled = ![states.preparation, states.underAttack, states.break].includes(this.defenseState.state) || (this.defenseState.state !== states.break && this.defenseState.breaksUsed >= this.defenseState.breaksAllowed);
    for (const btn of this.controlButtons) btn.update(arrayOfSprites, keys, mouse);

    return false;
  }

  updateDefenseTimer() {
    if (!this.defenseState.timerRunning) return;
    const now = performance.now();
    if (!this.defenseState.lastTickAt) this.defenseState.lastTickAt = now;
    const elapsedSeconds = (now - this.defenseState.lastTickAt) / 1000;
    this.defenseState.lastTickAt = now;
    const states = this.config.defenseStates;

    if (this.defenseState.state === states.preparation) {
      this.defenseState.preparationTimer = Math.max(0, this.defenseState.preparationTimer - elapsedSeconds);
      if (this.defenseState.preparationTimer === 0) {
        this.setDefenseState(states.underAttack);
        this.setMessage(this.config.messages.preparationEnded);
      }
      return;
    }

    if (this.defenseState.state === states.break) {
      this.defenseState.breakTimer = Math.max(0, this.defenseState.breakTimer - elapsedSeconds);
      if (this.defenseState.breakTimer === 0) {
        this.setDefenseState(this.defenseState.previousState || states.underAttack);
        this.setMessage(this.config.messages.breakEnded);
      }
    }
  }

  draw(ctx) { this.drawPanelBackground(ctx); this.drawSectionTitles(ctx); this.drawShop(ctx); this.drawDefenseSection(ctx); this.drawInfoSection(ctx); }
  drawPanelBackground(ctx) {
    const style = this.config.style;
    ctx.save();
    const bg = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    bg.addColorStop(0, style.panelTop); bg.addColorStop(0.5, style.panelMiddle); bg.addColorStop(1, style.panelBottom);
    ctx.fillStyle = bg; ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = style.border; ctx.lineWidth = 4; ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
    this.drawSectionBox(ctx, this.config.layout.shop); this.drawSectionBox(ctx, this.config.layout.game); this.drawSectionBox(ctx, this.config.layout.info);
    ctx.restore();
  }
  drawSectionBox(ctx, section) {
    const style = this.config.style; ctx.save(); ctx.fillStyle = style.sectionFill; ctx.strokeStyle = style.sectionBorder; ctx.lineWidth = 2;
    ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(section.x, section.y, section.width, section.height, 12); else ctx.rect(section.x, section.y, section.width, section.height);
    ctx.fill(); ctx.stroke(); ctx.restore();
  }
  drawSectionTitles(ctx) {
    const style = this.config.style;
    ctx.save(); ctx.font = "bold 22px Arial"; ctx.fillStyle = style.titleColor; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText(this.config.titles.shop, this.config.layout.shop.x + 15, this.config.layout.shop.y + 12);
    ctx.fillText(this.config.titles.game, this.config.layout.game.x + 15, this.config.layout.game.y + 12);
    ctx.fillText(this.config.titles.info, this.config.layout.info.x + 15, this.config.layout.info.y + 12); ctx.restore();
  }
  drawShop(ctx) {
    const shop = this.config.layout.shop; const style = this.config.style;
    ctx.save(); ctx.font = "13px Arial"; ctx.fillStyle = style.mutedText; ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText(this.config.labels.shopHint, shop.x + 15, shop.y + 42);
    for (const btn of this.shopButtons) btn.draw(ctx); ctx.restore();
  }
  getDisplayTimer() {
    const states = this.config.defenseStates;
    if (this.defenseState.state === states.preparation) return this.defenseState.preparationTimer;
    if (this.defenseState.state === states.break) return this.defenseState.breakTimer;
    return 0;
  }
  drawDefenseSection(ctx) {
    const gameBox = this.config.layout.game; const style = this.config.style; const labels = this.config.labels;
    ctx.save(); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "bold 15px Arial"; ctx.fillStyle = style.textColor;
    ctx.fillText(`${labels.state}: ${this.defenseState.state}`, gameBox.x + 20, gameBox.y + 45);
    ctx.font = "14px Arial"; ctx.fillStyle = style.mutedText;
    ctx.fillText(`${labels.timer}: ${this.formatTimer(this.getDisplayTimer())}`, gameBox.x + 20, gameBox.y + 130);
    ctx.fillText(`${labels.enemyLevel}: ${this.defenseState.enemyLevel}`, gameBox.x + 20, gameBox.y + 150);
    ctx.fillText(`${labels.remainingEnemies}: ${this.defenseState.enemyCount}`, gameBox.x + 150, gameBox.y + 130);
    ctx.fillText(`${labels.enemyHp}: x${this.defenseState.enemyHp.toFixed(2)}`, gameBox.x + 150, gameBox.y + 150);
    ctx.fillText(`${labels.enemySpeed}: x${this.defenseState.enemySpeed.toFixed(2)}`, gameBox.x + 20, gameBox.y + 168);
    for (const btn of this.controlButtons) btn.draw(ctx); ctx.restore();
  }
  drawInfoSection(ctx) {
    const style = this.config.style; const info = this.config.layout.info; const labels = this.config.labels;
    ctx.save(); ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.font = "bold 15px Arial"; ctx.fillStyle = style.textColor;
    ctx.fillText(`${labels.gold}: ${this.playerState.gold}G`, info.x + 16, info.y + 44);
    ctx.fillText(`${labels.level}: ${this.playerState.level}`, info.x + 160, info.y + 44);
    ctx.fillText(`${labels.xp}: ${this.playerState.xp}/${this.playerState.xpToNextLevel}`, info.x + 250, info.y + 44);
    ctx.font = "14px Arial"; ctx.fillStyle = style.mutedText;
    const selectedName = this.shopState.selectedItem ? this.shopState.selectedItem.fullName : labels.noSelection;
    ctx.fillText(`${labels.selected}: ${selectedName}`, info.x + 16, info.y + 74);
    ctx.fillText(`${labels.townHallHp}: ${this.townHallState.hp}/${this.townHallState.maxHp}`, info.x + 16, info.y + 96);
    ctx.fillText(this.shopState.message, info.x + 16, info.y + 122);
    ctx.restore();
  }
  formatTimer(seconds) { const value = Math.max(0, Math.floor(seconds)); const m = Math.floor(value / 60); const s = value % 60; return `${m}:${String(s).padStart(2, "0")}`; }
}
