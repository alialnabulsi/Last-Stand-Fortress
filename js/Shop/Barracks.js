class Barracks extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.troopCapacityBonus = itemConfig.troopCapacityBonus || 0;
  }

  update() {
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    this.updateAnimation(delta);
    return false;
  }
}
