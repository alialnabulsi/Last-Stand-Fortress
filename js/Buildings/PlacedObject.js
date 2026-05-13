class PlacedObject extends Sprite {
  constructor(tile, itemConfig, game, utils) {
    super();
    this.game = game;
    this.utils = utils;
    this.tile = tile;
    this.itemId = itemConfig.id;
    this.itemType = itemConfig.type || itemConfig.id;
    this.displayName = itemConfig.fullName || itemConfig.label || itemConfig.id;
    this.cost = itemConfig.cost || 0;
    this.unlockLevel = itemConfig.unlockLevel || 1;
    this.level = 1;
    this.tileRow = tile.row;
    this.tileCol = tile.col;
    this.x = tile.x;
    this.y = tile.y;
    this.size = tile.size || 40;
    this.width = this.size;
    this.height = this.size;
    this.isPlacedObject = true;
    this.isBuildableObject = true;
    this.selected = false;
    this.active = true;
    this.image = itemConfig.image || null;
    this.placeholderColor = itemConfig.placeholderColor || "#8f6d3a";
  }

  findPanel() {
    if (!this.game || !Array.isArray(this.game.arrayOfSprites)) return null;
    return this.game.arrayOfSprites.find((sprite) => sprite instanceof Panel) || null;
  }

  update() {
    return false;
  }

  draw(ctx) {
    if (this.image && this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
      return;
    }
    // TODO: Replace placeholder with final sprite sheet asset.
    ctx.save();
    ctx.fillStyle = this.placeholderColor;
    ctx.fillRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
    ctx.strokeStyle = "#1e1e1e";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x + 4, this.y + 4, this.size - 8, this.size - 8);
    ctx.restore();
  }
}

class GoldMine extends PlacedObject {}
class Barracks extends PlacedObject {}
class Archer extends PlacedObject {}
class Cannon extends PlacedObject {}
class Wizard extends PlacedObject {}
class Inferno extends PlacedObject {}

const PlacedObjectRegistry = {
  gold_mine: GoldMine,
  barracks: Barracks,
  archer: Archer,
  cannon: Cannon,
  wizard: Wizard,
  inferno_tower: Inferno,
};
