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

    this.shopRules = this.utils.ShopItemsData || {};

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
      maxLevel: 4,
      currentLevel: 1,
      preparationTimer: 10,
      breakDurationSeconds: 10,
      breakTimer: 10,
      timerRunning: false,
      lastTickAt: 0,
      breakLastTickAt: 0,
      previousStateBeforeBreak: null,
      breaksUsed: 0,
      breaksAllowed: 3,
      enemyLevel: 1,
      enemyCount: 0,
      enemyHp: 1,
      enemySpeed: 1,
      enemyDamage: 1,
      currentWave: 1,
      maxWaves: 1,
      spawnedEnemies: 0,
      defeatedEnemies: 0,
      activeEnemies: 0,
      enemiesRemaining: 0,
      totalEnemiesThisWave: 0,
      currentLevelTotalEnemies: 0,
      currentLevelRemainingEnemies: 0,
      completedEnemies: 0,
      remainingEnemiesInWave: 0,
      waveActive: false,
      waveCompleted: false,
      levelCompleted: false,
      finalProgressionCompleted: false,
      winReady: false,
      loseReady: false,
      gameOverPending: false,
      pendingResultState: null,
      spawnDelaySeconds: 1,
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
        if (this.defenseState.gameOverPending || this.defenseState.finalProgressionCompleted) {
          this.setMessage("Progression has ended.");
          return;
        }
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
      this.getBreakButtonLabel(),
      () => {
        if (this.isBreakActive()) {
          this.endBreak({ manual: true });
          return;
        }

        if (!this.canStartBreak()) {
          this.setMessage("Break can only be used during preparation or defense.");
          return;
        }

        if (this.defenseState.breaksUsed >= this.defenseState.breaksAllowed) {
          this.setMessage("No breaks left.");
          return;
        }

        this.startBreak();
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
    this.setMessage(`${item.fullName} selected. Click a buildable tile to place it.`);
  }

  clearSelection() {
    this.shopState.selectedItem = null;
    this.shopState.selectedItemId = null;
  }
  canAfford(cost) {
    return this.playerState.gold >= cost;
  }
  isShopItemUnlocked(itemId) {
    const rule = this.shopRules[itemId];
    return !!rule && this.playerState.level >= rule.unlockLevel;
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

    if (didLevelUp) this.updateEnemyInfo();
  }

  getLevelWaveConfig(level) {
    const waveData = this.utils.WaveData || {};
    return (waveData.levels && waveData.levels[level]) || waveData.default || null;
  }
  getCurrentWaveConfig() {
    const levelConfig = this.getLevelWaveConfig(this.defenseState.currentLevel);
    if (!levelConfig || !Array.isArray(levelConfig.waves)) return null;
    return levelConfig.waves[this.defenseState.currentWave - 1] || null;
  }
  updateEnemyInfo() {
    const levelConfig = this.getLevelWaveConfig(this.defenseState.currentLevel);
    if (!levelConfig) return;
    const waveConfig = this.getCurrentWaveConfig() || levelConfig.waves[0] || {};
    this.defenseState.maxLevel = (this.utils.WaveData && this.utils.WaveData.maxLevel) || 4;
    this.defenseState.maxWaves = levelConfig.maxWaves || levelConfig.waves.length || 1;
    this.defenseState.currentLevelTotalEnemies = levelConfig.totalEnemies || 0;
    this.defenseState.currentLevelRemainingEnemies = Math.max(0, this.defenseState.currentLevelTotalEnemies - this.defenseState.completedEnemies);
    this.defenseState.enemyLevel = waveConfig.enemyLevel || this.defenseState.currentLevel;
    this.defenseState.enemyCount = waveConfig.enemyCount || 1;
    this.defenseState.enemyHp = waveConfig.enemyHp || 1;
    this.defenseState.enemySpeed = waveConfig.enemySpeed || 1;
    this.defenseState.enemyDamage = waveConfig.enemyDamage || 1;
    this.defenseState.spawnDelaySeconds = waveConfig.spawnDelaySeconds || 1;
    this.defenseState.totalEnemiesThisWave = this.defenseState.enemyCount;
    this.defenseState.enemiesRemaining = Math.max(0, this.defenseState.totalEnemiesThisWave - this.defenseState.spawnedEnemies);
    this.defenseState.remainingEnemiesInWave = Math.max(0, this.defenseState.totalEnemiesThisWave - this.defenseState.defeatedEnemies);
  }

  setMessage(message) {
    this.shopState.message = message;
  }

  getBreakButtonLabel() {
    const nextBreakNumber = this.defenseState.breaksUsed + 1;
    return this.config.breakLabelTemplate.replace("{n}", nextBreakNumber);
  }

  canStartBreak() {
    return (
      this.defenseState.state === "PREPARATION" ||
      this.defenseState.state === "UNDER_ATTACK"
    );
  }

  isBreakActive() {
    return this.defenseState.state === "BREAK";
  }

  isRuntimePaused() {
    return this.isBreakActive();
  }

  canRuntimeUpdate() {
    return !this.isRuntimePaused();
  }

  startBreak() {
    const now = performance.now();
    this.defenseState.previousStateBeforeBreak = this.defenseState.state;
    this.defenseState.state = "BREAK";
    this.defenseState.breakTimer = this.defenseState.breakDurationSeconds;
    this.defenseState.breakLastTickAt = now;
    this.setMessage("Break activated.");

    // TODO: Runtime sprites (enemies/spawners/gold mines/towers) should find Panel
    // and skip runtime updates when panel.canRuntimeUpdate() returns false.
  }

  endBreak({ manual = false } = {}) {
    if (!this.isBreakActive()) return;

    const resumeState =
      this.defenseState.previousStateBeforeBreak === "PREPARATION"
        ? "PREPARATION"
        : "UNDER_ATTACK";

    this.defenseState.state = resumeState;
    this.defenseState.previousStateBeforeBreak = null;
    this.defenseState.breakTimer = this.defenseState.breakDurationSeconds;
    this.defenseState.breakLastTickAt = 0;
    this.defenseState.breaksUsed += 1;
    this.defenseState.lastTickAt = performance.now();

    this.takeBreakButton.text = this.getBreakButtonLabel();
    this.setMessage(
      manual
        ? `Break ended early. Resuming ${resumeState.toLowerCase()}.`
        : `Break ended. Resuming ${resumeState.toLowerCase()}.`,
    );
  }

  findTownHall(arrayOfSprites) {
    const hasTownHallClass = typeof TownHall !== "undefined";
    for (let i = 0; i < arrayOfSprites.length; i++) {
      const sprite = arrayOfSprites[i];
      const isTownHallInstance = hasTownHallClass && sprite instanceof TownHall;

      if (sprite && (isTownHallInstance || sprite.isTownHall === true)) {
        this.townHallState.townHall = sprite;
        this.updateTownHallInfo(sprite);
        return sprite;
      }
    }

    this.townHallState.townHall = null;
    return null;
  }

  update(arrayOfSprites, keys, mouse) {
    if (!this.townHallState.townHall) this.findTownHall(arrayOfSprites);
    if (this.townHallState.townHall) {
      this.updateTownHallInfo(this.townHallState.townHall);
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
      this.defenseState.state === "UNDER_ATTACK" || this.isBreakActive();
    this.takeBreakButton.disabled =
      (!this.canStartBreak() && !this.isBreakActive()) ||
      this.defenseState.breaksUsed >= this.defenseState.breaksAllowed;
    this.takeBreakButton.text = this.getBreakButtonLabel();
    for (const btn of this.controlButtons)
      btn.update(arrayOfSprites, keys, mouse);

    return false;
  }

  updateDefenseTimer() {
    const now = performance.now();

    if (this.defenseState.state === "BREAK") {
      if (!this.defenseState.breakLastTickAt) this.defenseState.breakLastTickAt = now;
      const breakElapsedSeconds = (now - this.defenseState.breakLastTickAt) / 1000;
      this.defenseState.breakLastTickAt = now;
      this.defenseState.breakTimer = Math.max(
        0,
        this.defenseState.breakTimer - breakElapsedSeconds,
      );

      if (this.defenseState.breakTimer === 0) this.endBreak();
      return;
    }

    if (!this.defenseState.timerRunning || this.isRuntimePaused()) return;

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

  }

  onPlanningStarted() {
    this.defenseState.preparationTimer = 10;
    this.defenseState.waveCompleted = false;
    this.defenseState.waveActive = false;
  }

  onPlanningEnded() {
  }

  onDefenseStarted() {
    this.updateEnemyInfo();
    this.resetWaveRuntimeCounters();
    this.defenseState.waveActive = true;
    this.defenseState.waveCompleted = false;
  }

  onDefenseEnded({ townHallAlive = true } = {}) {
    if (!townHallAlive) {
      this.defenseState.loseReady = true;
      this.defenseState.gameOverPending = true;
      this.defenseState.pendingResultState = "LOSE_READY";
      this.defenseState.state = "IDLE";
      this.defenseState.waveActive = false;
      this.defenseState.timerRunning = false;
      // TODO: Trigger final lose message/screen in the result system task.
      this.setMessage("Town Hall destroyed. Defense failed.");
    }
  }

  resetWaveRuntimeCounters() {
    this.defenseState.spawnedEnemies = 0;
    this.defenseState.defeatedEnemies = 0;
    this.defenseState.activeEnemies = 0;
    this.defenseState.totalEnemiesThisWave = this.defenseState.enemyCount;
    this.defenseState.enemiesRemaining = this.defenseState.enemyCount;
    this.defenseState.remainingEnemiesInWave = this.defenseState.enemyCount;
  }

  getWaveRuntimeState() {
    return {
      currentWave: this.defenseState.currentWave,
      maxWaves: this.defenseState.maxWaves,
      totalEnemies: this.defenseState.totalEnemiesThisWave,
      spawnedEnemies: this.defenseState.spawnedEnemies,
      defeatedEnemies: this.defenseState.defeatedEnemies,
      activeEnemies: this.defenseState.activeEnemies,
      enemiesRemaining: this.defenseState.enemiesRemaining,
      currentEnemyLevel: this.defenseState.enemyLevel,
      enemyHp: this.defenseState.enemyHp,
      enemySpeed: this.defenseState.enemySpeed,
      enemyDamage: this.defenseState.enemyDamage,
      spawnDelaySeconds: this.defenseState.spawnDelaySeconds,
    };
  }

  onEnemySpawned(enemy) {
    this.defenseState.spawnedEnemies += 1;
    this.defenseState.activeEnemies += 1;
    this.defenseState.enemiesRemaining = Math.max(
      0,
      this.defenseState.totalEnemiesThisWave - this.defenseState.spawnedEnemies,
    );

    this.defenseState.remainingEnemiesInWave = Math.max(
      0,
      this.defenseState.totalEnemiesThisWave - this.defenseState.defeatedEnemies,
    );
  }
  onEnemyHandled() {
    this.defenseState.defeatedEnemies += 1;
    this.defenseState.completedEnemies += 1;
    this.defenseState.activeEnemies = Math.max(0, this.defenseState.activeEnemies - 1);
    this.defenseState.remainingEnemiesInWave = Math.max(0, this.defenseState.totalEnemiesThisWave - this.defenseState.defeatedEnemies);
    this.defenseState.currentLevelRemainingEnemies = Math.max(0, this.defenseState.currentLevelTotalEnemies - this.defenseState.completedEnemies);
    this.tryCompleteWave();
  }
  onEnemyKilled(enemy) {
    this.onEnemyHandled();
    this.setMessage("An enemy was defeated.");
  }
  onEnemyReachedTownHall(enemy) {
    this.onEnemyHandled();
    this.setMessage(`An enemy reached the Town Hall.`);
  }
  onEnemyPathFailed(enemy) {
    this.onEnemyHandled();
    this.setMessage("Enemy could not find a path to the Town Hall.");
  }

  tryCompleteWave() {
    const isDone = this.defenseState.spawnedEnemies >= this.defenseState.totalEnemiesThisWave && this.defenseState.activeEnemies === 0;
    if (!isDone || this.defenseState.waveCompleted) return;
    this.completeWave();
    if (this.isFinalLevel() && this.isFinalWave()) {
      this.defenseState.finalProgressionCompleted = true;
      this.defenseState.winReady = this.townHallState.hp > 0;
      this.defenseState.pendingResultState = this.defenseState.winReady ? "WIN_READY" : this.defenseState.pendingResultState;
      // TODO: Trigger final win message/screen in the result system task.
      this.setMessage("Final wave completed.");
      return;
    }
    this.advanceProgression();
  }

  completeWave() {
    this.defenseState.waveCompleted = true;
    this.defenseState.waveActive = false;
    this.defenseState.state = "IDLE";
    this.defenseState.timerRunning = false;
  }

  isFinalLevel() {
    return this.defenseState.currentLevel >= this.defenseState.maxLevel;
  }

  isFinalWave() {
    return this.defenseState.currentWave >= this.defenseState.maxWaves;
  }

  advanceWave() {
    if (this.isFinalWave()) return false;
    this.defenseState.currentWave += 1;
    this.defenseState.levelCompleted = false;
    return true;
  }

  advanceLevel() {
    if (this.isFinalLevel()) return false;
    this.defenseState.levelCompleted = true;
    const previousTownHallHp = this.townHallState.hp;
    this.defenseState.currentLevel += 1;
    this.defenseState.currentWave = 1;
    this.playerState.level = this.defenseState.currentLevel;
    this.clearRuntimeEnemies();
    if (this.game.currentGameLevel) {
      this.game.currentGameLevel.changeMapForPlayerLevel(this.playerState.level);
    }
    this.findTownHall(this.game.arrayOfSprites);
    if (this.townHallState.townHall && typeof previousTownHallHp === "number") {
      this.townHallState.townHall.hp = Math.max(0, Math.min(this.townHallState.townHall.maxHp, previousTownHallHp));
      this.townHallState.townHall.destroyed = this.townHallState.townHall.hp <= 0;
      this.updateTownHallInfo(this.townHallState.townHall);
    }
    // TODO: Decide whether Town Hall HP should reset per level. Current behavior preserves HP across levels.
    return true;
  }

  startPreparationForCurrentWave(message) {
    this.defenseState.state = "PREPARATION";
    this.defenseState.timerRunning = true;
    this.defenseState.lastTickAt = performance.now();
    this.onPlanningStarted();
    this.updateEnemyInfo();
    this.setMessage(message);
  }

  clearRuntimeEnemies() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return;
    this.game.arrayOfSprites = this.game.arrayOfSprites.filter(
      (sprite) => !(sprite && sprite.isEnemy === true),
    );
    this.defenseState.activeEnemies = 0;
  }

  advanceProgression() {
    if (this.advanceWave()) {
      this.updateEnemyInfo();
      this.startPreparationForCurrentWave(
        `Wave ${this.defenseState.currentWave} is next. Prepare defenses.`,
      );
    } else {
      if (!this.advanceLevel()) return;
      this.updateEnemyInfo();
      this.startPreparationForCurrentWave(
        `Level ${this.defenseState.currentLevel} started. Prepare defenses.`,
      );
    }
  }

  updateTownHallInfo(townHall) {
    if (!townHall) return;
    if (typeof townHall.getHPInfo === "function") {
      const hpInfo = townHall.getHPInfo();
      this.townHallState.hp = hpInfo.hp;
      this.townHallState.maxHp = hpInfo.maxHp;
      return;
    }
    this.townHallState.hp = townHall.hp;
    this.townHallState.maxHp = townHall.maxHp;
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
    const activeTimer = this.isBreakActive()
      ? this.defenseState.breakTimer
      : this.defenseState.state === "PREPARATION"
        ? this.defenseState.preparationTimer
        : 0;
    ctx.fillText(
      `Level: ${this.defenseState.currentLevel}/${this.defenseState.maxLevel}`,
      gameBox.x + 20,
      gameBox.y + 112,
    );
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
      `Wave: ${this.defenseState.currentWave}/${this.defenseState.maxWaves}`,
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

    ctx.fillText(
      `Spawned: ${this.defenseState.spawnedEnemies}/${this.defenseState.totalEnemiesThisWave}`,
      gameBox.x + 150,
      gameBox.y + 168,
    );
    ctx.fillText(
      `Wave Left: ${this.defenseState.remainingEnemiesInWave}`,
      gameBox.x + 150,
      gameBox.y + 186,
    );
    ctx.fillText(
      `Level Left: ${this.defenseState.currentLevelRemainingEnemies}`,
      gameBox.x + 20,
      gameBox.y + 186,
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
