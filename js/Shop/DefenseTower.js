class DefenseTower extends ShopPlaceable {
  constructor(anchor, itemConfig, game, utils) {
    super(anchor, itemConfig, game, utils);
    this.range = itemConfig.range || 100;
    this.damage = itemConfig.damage || 1;
    this.attackCooldownMs = itemConfig.attackCooldownMs || 1000;
    this.targetType = itemConfig.targetType || "ground";
    this.cooldownElapsedMs = this.attackCooldownMs;
    this.lastAttackAt = 0;
  }

  findTarget() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;
    const enemies = this.game.arrayOfSprites.filter((sprite) => sprite && sprite.isEnemy === true && typeof sprite.isAlive === "function" && sprite.isAlive());
    let target = null;
    let minDistance = Infinity;
    for (const enemy of enemies) {
      const ex = enemy.x + enemy.size / 2;
      const ey = enemy.y + enemy.size / 2;
      const distance = Math.hypot(ex - centerX, ey - centerY);
      if (distance <= this.range && distance < minDistance) {
        minDistance = distance;
        target = enemy;
      }
    }
    return target;
  }

  update() {
    const panel = this.findPanel();
    const now = performance.now();
    const delta = now - this.lastRuntimeAt;
    this.lastRuntimeAt = now;
    this.updateAnimation(delta);
    if (!panel || !panel.canRuntimeUpdate || !panel.canRuntimeUpdate()) return false;
    if (panel.defenseState.state !== "UNDER_ATTACK") return false;
    this.cooldownElapsedMs += Math.max(0, delta);
    if (this.cooldownElapsedMs < this.attackCooldownMs) return false;
    const target = this.findTarget();
    if (!target) return false;
    this.cooldownElapsedMs = 0;
    this.lastAttackAt = now;
    this.attackAnimationUntil = now + Math.max(220, this.frameDurationMs * Math.min(3, this.attackFrameCount));
    target.takeDamage(this.damage);
    return false;
  }
}
