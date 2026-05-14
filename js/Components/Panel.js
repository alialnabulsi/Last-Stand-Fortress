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
      gold: 280,
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
      preparationTimer: 12,
      breakDurationSeconds: 8,
      breakTimer: 8,
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
      enemyGoldReward: 10,
      enemyXpReward: 5,
    };

    this.townHallState = {
      townHall: null,
      hp: this.getConfiguredTownHallMaxHp(),
      maxHp: this.getConfiguredTownHallMaxHp(),
    };

    this.shopButtons = [];
    this.controlButtons = [];
    this.townHallDestroyedHandled = false;

    this.createShopButtons();
    this.createGameButtons();
    this.updateEnemyInfo();
  }

  getConfiguredTownHallMaxHp() {
    const townHallData = this.utils && this.utils.TownHallData ? this.utils.TownHallData : null;
    return townHallData && typeof townHallData.maxHp === "number" ? townHallData.maxHp : 100;
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
      gameBox.x + 18,
      gameBox.y + 140,
      92,
      34,
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
        this.setMessage(`Preparation started for Wave ${this.defenseState.currentWave}/${this.defenseState.maxWaves}. Build now, then defend.`);
      },
      {
        icon: "⚔",
        description: "Start wave",
        style,
      },
    );

    this.takeBreakButton = new PanelButton(
      gameBox.x + 124,
      gameBox.y + 140,
      108,
      34,
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

    this.menuButton = new PanelButton(
      gameBox.x + 246,
      gameBox.y + 140,
      76,
      34,
      "MENU",
      () => this.returnToMenu(),
      {
        icon: "<",
        description: "Back",
        style,
      },
    );

    this.controlButtons = [this.startDefenseButton, this.takeBreakButton, this.menuButton];
  }

  returnToMenu() {
    const level = this.getActiveLevel();
    if (level && level.sound && typeof level.sound.stopAll === "function") {
      level.sound.stopAll();
    }
    this.game.changeLevel(0);
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
    const targetHint = item.id === "buildable_tile" ? "grass" : "Buildable foundation";
    this.playSfx("SHOP_ITEM_SELECTED");
    this.setMessage(`${item.fullName} selected. Place on ${targetHint}.`);
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
  getConfiguredWaves(levelConfig) {
    return levelConfig && Array.isArray(levelConfig.waves) ? levelConfig.waves : [];
  }
  getConfiguredWaveCount(levelConfig) {
    return this.getConfiguredWaves(levelConfig).length || 1;
  }
  getConfiguredTotalEnemies(levelConfig) {
    return this.getConfiguredWaves(levelConfig).reduce(
      (total, wave) => total + (wave.enemyCount || 0),
      0,
    );
  }
  updateEnemyInfo() {
    const levelConfig = this.getLevelWaveConfig(this.defenseState.currentLevel);
    if (!levelConfig) return;
    const waveConfig = this.getCurrentWaveConfig() || levelConfig.waves[0] || {};
    this.defenseState.maxLevel = (this.utils.WaveData && this.utils.WaveData.maxLevel) || 4;
    this.defenseState.maxWaves = this.getConfiguredWaveCount(levelConfig);
    this.defenseState.currentLevelTotalEnemies = this.getConfiguredTotalEnemies(levelConfig);
    this.defenseState.currentLevelRemainingEnemies = Math.max(0, this.defenseState.currentLevelTotalEnemies - this.defenseState.completedEnemies);
    this.defenseState.enemyLevel = waveConfig.enemyLevel || this.defenseState.currentLevel;
    this.defenseState.enemyCount = waveConfig.enemyCount || 1;
    this.defenseState.enemyHp = waveConfig.enemyHp || 1;
    this.defenseState.enemySpeed = waveConfig.enemySpeed || 1;
    this.defenseState.enemyDamage = waveConfig.enemyDamage || 1;
    this.defenseState.spawnDelaySeconds = waveConfig.spawnDelaySeconds || 1;
    this.defenseState.enemyGoldReward = waveConfig.enemyGoldReward || 10;
    this.defenseState.enemyXpReward = waveConfig.enemyXpReward || 5;
    this.defenseState.totalEnemiesThisWave = this.defenseState.enemyCount;
    this.defenseState.enemiesRemaining = Math.max(0, this.defenseState.totalEnemiesThisWave - this.defenseState.spawnedEnemies);
    this.defenseState.remainingEnemiesInWave = Math.max(0, this.defenseState.totalEnemiesThisWave - this.defenseState.defeatedEnemies);
  }

  setMessage(message) {
    this.shopState.message = message;
  }

  getActiveLevel() {
    if (!this.game || !Array.isArray(this.game.levels)) return null;
    return this.game.levels[this.game.currentLevelIndex] || null;
  }

  playSfx(key) {
    const level = this.getActiveLevel();
    if (level && typeof level.playSfx === "function") level.playSfx(key);
  }

  playFinalSfx(key) {
    const level = this.getActiveLevel();
    if (!level) return;
    if (typeof level.stopMusic === "function") level.stopMusic();
    if (typeof level.playSfx === "function") level.playSfx(key);
  }

  getBreakButtonLabel() {
    if (this.isBreakActive()) return "Skip Break";
    const nextBreakNumber = this.defenseState.breaksUsed + 1;
    return this.config.breakLabelTemplate.replace("{n}", nextBreakNumber);
  }

  canStartBreak() {
    return (
      this.defenseState.state === "PREPARATION" ||
      this.defenseState.state === "UNDER_ATTACK"
    );
  }


  canPlaceDuringCurrentPhase() {
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
    const activeLevel = this.getActiveLevel();
    if (activeLevel && typeof activeLevel.getTownHallTile === "function") {
      const levelTownHall = activeLevel.getTownHallTile();
      if (levelTownHall && this.isTownHallSpriteActive(levelTownHall, arrayOfSprites)) {
        this.townHallState.townHall = levelTownHall;
        this.updateTownHallInfo(levelTownHall);
        return levelTownHall;
      }
    }

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

  isTownHallSpriteActive(townHall, arrayOfSprites) {
    if (!townHall || !Array.isArray(arrayOfSprites)) return false;
    return arrayOfSprites.includes(townHall);
  }

  update(arrayOfSprites, keys, mouse) {
    if (!this.isTownHallSpriteActive(this.townHallState.townHall, arrayOfSprites)) {
      this.townHallState.townHall = null;
    }
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
    this.takeBreakButton.description = this.isBreakActive()
      ? "Resume now"
      : "Pause phase";
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
        this.setMessage(`Wave ${this.defenseState.currentWave} started. Enemies are attacking.`);
      }
      return;
    }

  }

  onPlanningStarted() {
    this.defenseState.preparationTimer = 12;
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
      this.defenseState.finalProgressionCompleted = true;
      this.defenseState.state = "IDLE";
      this.defenseState.waveActive = false;
      this.defenseState.timerRunning = false;
      this.clearRuntimeEnemies();
      this.resetSpawnerRuntimeCounters();
      this.playFinalSfx("LOSE");
      this.setMessage("Town Hall destroyed. Defense failed.");
    }
  }

  resetSpawnerRuntimeCounters() {
    const level = this.getActiveLevel();
    if (!level || typeof level.getSpawnerTiles !== "function") return;
    const spawners = level.getSpawnerTiles();
    for (let i = 0; i < spawners.length; i++) {
      const spawner = spawners[i];
      if (!spawner) continue;
      spawner.spawnedCount = 0;
      spawner.spawnElapsedMs = 0;
      spawner.lastSpawnTickAt = 0;
      spawner.spawn = false;
    }
  }

  resetWaveRuntimeCounters() {
    this.defenseState.spawnedEnemies = 0;
    this.defenseState.defeatedEnemies = 0;
    this.defenseState.activeEnemies = 0;
    this.defenseState.totalEnemiesThisWave = this.defenseState.enemyCount;
    this.defenseState.enemiesRemaining = this.defenseState.enemyCount;
    this.defenseState.remainingEnemiesInWave = this.defenseState.enemyCount;
    this.resetSpawnerRuntimeCounters();
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
    const level = this.getActiveLevel();
    if (level && typeof level.playEnemySfx === "function") {
      level.playEnemySfx(enemy && enemy.enemyLevel ? enemy.enemyLevel : this.defenseState.enemyLevel);
    }
  }
  onEnemyHandled() {
    if (this.defenseState.gameOverPending || this.defenseState.finalProgressionCompleted) return;

    this.defenseState.defeatedEnemies += 1;
    this.defenseState.completedEnemies += 1;
    this.defenseState.activeEnemies = Math.max(0, this.defenseState.activeEnemies - 1);
    this.defenseState.remainingEnemiesInWave = Math.max(0, this.defenseState.totalEnemiesThisWave - this.defenseState.defeatedEnemies);
    this.defenseState.currentLevelRemainingEnemies = Math.max(0, this.defenseState.currentLevelTotalEnemies - this.defenseState.completedEnemies);
    this.tryCompleteWave();
  }
  onEnemyKilled(enemy) {
    this.addGold(this.defenseState.enemyGoldReward);
    this.addXP(this.defenseState.enemyXpReward);
    this.onEnemyHandled();
    this.setMessage(`Enemy defeated. +${this.defenseState.enemyGoldReward}G. Wave left: ${this.defenseState.remainingEnemiesInWave}.`);
  }
  onEnemyReachedTownHall(enemy) {
    this.onEnemyHandled();
    this.playSfx("ENEMY_HIT_TOWN_HALL");
    this.setMessage(`An enemy reached the Town Hall for ${enemy && enemy.damage ? enemy.damage : 0} damage.`);
  }
  onEnemyPathFailed(enemy) {
    this.onEnemyHandled();
    this.setMessage("Enemy could not find a path to the Town Hall.");
  }

  tryCompleteWave() {
    if (this.defenseState.gameOverPending || this.defenseState.finalProgressionCompleted) return;

    const isDone = this.defenseState.spawnedEnemies >= this.defenseState.totalEnemiesThisWave && this.defenseState.activeEnemies === 0;
    if (!isDone || this.defenseState.waveCompleted) return;
    this.completeWave();
    if (this.isFinalLevel() && this.isFinalWave()) {
      this.defenseState.finalProgressionCompleted = true;
      this.defenseState.winReady = this.townHallState.hp > 0;
      this.defenseState.pendingResultState = this.defenseState.winReady ? "WIN_READY" : this.defenseState.pendingResultState;
      if (this.defenseState.winReady) this.playFinalSfx("WIN");
      this.setMessage("Final wave completed. Victory!");
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
    this.defenseState.completedEnemies = 0;
    this.playerState.level = this.defenseState.currentLevel;
    this.clearRuntimeEnemies();
    const level = this.getActiveLevel();
    if (level && typeof level.changeMapForPlayerLevel === "function") {
      level.changeMapForPlayerLevel(this.playerState.level);
    }
    this.findTownHall(this.game.arrayOfSprites);
    if (this.townHallState.townHall && typeof previousTownHallHp === "number") {
      this.townHallState.townHall.hp = Math.max(0, Math.min(this.townHallState.townHall.maxHp, previousTownHallHp));
      this.townHallState.townHall.destroyed = this.townHallState.townHall.hp <= 0;
      this.updateTownHallInfo(this.townHallState.townHall);
    }
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
    if (this.defenseState.gameOverPending || this.defenseState.finalProgressionCompleted) return;

    if (this.advanceWave()) {
      this.updateEnemyInfo();
      this.startPreparationForCurrentWave(
        `Wave ${this.defenseState.currentWave} is next. Prepare defenses.`,
      );
    } else {
      if (!this.advanceLevel()) return;
      this.playSfx("LEVEL_UPGRADE");
      this.updateEnemyInfo();
      this.startPreparationForCurrentWave(
        `Level ${this.defenseState.currentLevel} started. New map loaded; place a Buildable foundation on grass first.`,
      );
    }
  }


  onMapChanged(level) {
    this.clearSelection();
    this.defenseState.waveActive = false;
    this.defenseState.waveCompleted = false;
    this.defenseState.timerRunning = false;
    this.defenseState.lastTickAt = 0;
    this.defenseState.breakLastTickAt = 0;
    this.defenseState.breakTimer = this.defenseState.breakDurationSeconds;
    this.defenseState.state = "IDLE";
    this.defenseState.spawnedEnemies = 0;
    this.defenseState.defeatedEnemies = 0;
    this.defenseState.activeEnemies = 0;
    this.defenseState.enemiesRemaining = 0;
    this.defenseState.remainingEnemiesInWave = 0;
    this.townHallDestroyedHandled = false;
    this.resetSpawnerRuntimeCounters();
    this.findTownHall(this.game.arrayOfSprites);
    if (this.townHallState.townHall && typeof this.townHallState.townHall.setLevel === "function") {
      this.townHallState.townHall.setLevel(level);
      this.updateTownHallInfo(this.townHallState.townHall);
    }
    this.updateEnemyInfo();
    this.setMessage(`Level ${level} loaded. Select Buildable to rebuild defenses.`);
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
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = style.titleColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      this.config.titles.shop,
      this.config.layout.shop.x + 15,
      this.config.layout.shop.y + 10,
    );
    ctx.fillText(
      this.config.titles.game,
      this.config.layout.game.x + 15,
      this.config.layout.game.y + 10,
    );
    ctx.fillText(
      this.config.titles.info,
      this.config.layout.info.x + 15,
      this.config.layout.info.y + 10,
    );
    ctx.restore();
  }

  drawShop(ctx) {
    const shop = this.config.layout.shop;
    const style = this.config.style;

    ctx.save();
    ctx.font = "12px Arial";
    ctx.fillStyle = style.mutedText;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(
      "Select what you want to place on the map.",
      shop.x + 15,
      shop.y + 34,
    );

    for (const btn of this.shopButtons) btn.draw(ctx);
    ctx.restore();
  }

  drawDefenseSection(ctx) {
    const gameBox = this.config.layout.game;
    const style = this.config.style;
    const leftX = gameBox.x + 18;
    const midX = gameBox.x + 150;
    const rightX = gameBox.x + 278;

    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 13px Arial";
    ctx.fillStyle = style.textColor;
    ctx.fillText(`Phase: ${this.getPhaseLabel()}`, leftX, gameBox.y + 36);

    ctx.font = "12px Arial";
    ctx.fillStyle = style.mutedText;
    const activeTimer = this.isBreakActive()
      ? this.defenseState.breakTimer
      : this.defenseState.state === "PREPARATION"
        ? this.defenseState.preparationTimer
        : 0;
    ctx.fillText(`Timer: ${this.formatTimer(activeTimer)}`, midX, gameBox.y + 37);

    ctx.fillText(`Level ${this.defenseState.currentLevel}/${this.defenseState.maxLevel}`, leftX, gameBox.y + 62);
    ctx.fillText(`Wave ${this.defenseState.currentWave}/${this.defenseState.maxWaves}`, midX, gameBox.y + 62);
    ctx.fillText(`Enemy Lv ${this.defenseState.enemyLevel}`, rightX, gameBox.y + 62);

    ctx.fillText(`HP x${this.defenseState.enemyHp.toFixed(2)}`, leftX, gameBox.y + 84);
    ctx.fillText(`Speed x${this.defenseState.enemySpeed.toFixed(2)}`, midX, gameBox.y + 84);
    ctx.fillText(`Alive ${this.defenseState.activeEnemies}`, rightX, gameBox.y + 84);

    ctx.fillText(`Defeated ${this.defenseState.defeatedEnemies}/${this.defenseState.totalEnemiesThisWave}`, leftX, gameBox.y + 106);
    ctx.fillText(`Level Left ${this.defenseState.currentLevelRemainingEnemies}`, midX, gameBox.y + 106);

    for (const btn of this.controlButtons) btn.draw(ctx);
    ctx.restore();
  }

  drawInfoSection(ctx) {
    const style = this.config.style;
    const info = this.config.layout.info;

    ctx.save();
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = style.textColor;
    ctx.fillText(`Gold: ${this.playerState.gold}G`, info.x + 16, info.y + 38);
    ctx.fillText(`Level: ${this.playerState.level}`, info.x + 158, info.y + 38);
    ctx.fillText(
      `XP: ${this.playerState.xp}/${this.playerState.xpToNextLevel}`,
      info.x + 250,
      info.y + 38,
    );

    ctx.font = "13px Arial";
    ctx.fillStyle = style.mutedText;
    const selectedName = this.shopState.selectedItem
      ? this.shopState.selectedItem.fullName
      : "None";
    ctx.fillText(`Selected: ${selectedName}`, info.x + 16, info.y + 66);
    ctx.fillText(
      `Town Hall HP: ${this.townHallState.hp}/${this.townHallState.maxHp}`,
      info.x + 16,
      info.y + 88,
    );
    const statusMessage = this.getFortressStatusMessage();
    ctx.fillStyle = this.getFortressStatusColor(style);
    this.drawWrappedText(ctx, statusMessage, info.x + 16, info.y + 114, info.width - 30, 17);

    ctx.restore();
  }

  

  getPhaseLabel() {
    if (this.defenseState.pendingResultState === "WIN_READY") return "VICTORY";
    if (this.defenseState.pendingResultState === "LOSE_READY") return "DEFEAT";
    if (this.defenseState.state === "PREPARATION") return "PREPARATION";
    if (this.defenseState.state === "UNDER_ATTACK") return "UNDER ATTACK";
    if (this.defenseState.state === "BREAK") return "BREAK";
    return "IDLE";
  }

  getFortressStatusMessage() {
    if (this.defenseState.pendingResultState === "WIN_READY") {
      return "VICTORY: Final wave cleared!";
    }
    if (this.defenseState.pendingResultState === "LOSE_READY") {
      return "DEFEAT: Town Hall destroyed.";
    }
    return this.shopState.message;
  }

  getFortressStatusColor(style) {
    if (this.defenseState.pendingResultState === "WIN_READY") return style.good;
    if (this.defenseState.pendingResultState === "LOSE_READY") return style.danger;
    return style.mutedText;
  }

  drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = String(text || "").split(" ");
    let line = "";
    let lineY = y;
    for (let i = 0; i < words.length; i++) {
      const nextLine = line ? `${line} ${words[i]}` : words[i];
      if (ctx.measureText(nextLine).width > maxWidth && line) {
        ctx.fillText(line, x, lineY);
        line = words[i];
        lineY += lineHeight;
      } else line = nextLine;
    }
    if (line) ctx.fillText(line, x, lineY);
  }

  formatTimer(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    const m = Math.floor(value / 60);
    const s = value % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }
}
