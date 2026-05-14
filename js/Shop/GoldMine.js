class GoldMine extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.productionAmount = itemConfig.productionAmount || 0;
    this.productionIntervalMs = itemConfig.productionIntervalMs || 6000;
    this.productionElapsedMs = 0;
  }

  update() {
    const panel = this.findPanel();
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    this.updateAnimation(delta);
    if (!panel || !panel.canRuntimeUpdate || !panel.canRuntimeUpdate()) return false;
    this.productionElapsedMs += Math.max(0, delta);
    while (this.productionElapsedMs >= this.productionIntervalMs) {
      panel.addGold(this.productionAmount);
      this.productionElapsedMs -= this.productionIntervalMs;
    }
    return false;
  }
}
