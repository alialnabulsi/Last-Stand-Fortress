const ShopPlaceableRegistry = {
  buildable_tile: Buildable,
  gold_mine: GoldMine,
  barracks: Barracks,
  archer: Archer,
  cannon: Cannon,
  wizard: Wizard,
  inferno_tower: Inferno,
};

function getSelectedShopPlaceableConfig(panel) {
  if (!panel || !panel.shopState || !panel.shopState.selectedItemId) return null;
  const itemId = panel.shopState.selectedItemId;
  const rule = panel.shopRules && panel.shopRules[itemId];
  if (!rule) return null;
  return { ...panel.shopState.selectedItem, ...rule };
}

function createShopPlaceableFromRegistry(itemId, anchor, panel, itemConfig) {
  const Constructor = ShopPlaceableRegistry[itemId];
  if (!Constructor || !anchor || !panel) return null;
  const config = itemConfig || getSelectedShopPlaceableConfig(panel);
  if (!config) return null;
  return new Constructor(anchor, config, panel.game, panel.utils);
}

function addShopPlaceableSprite(game, sprite, anchor) {
  if (!game || !Array.isArray(game.arrayOfSprites)) return false;

  let insertIndex = game.arrayOfSprites.findIndex((existing) => existing instanceof Panel);
  if (insertIndex < 0) insertIndex = game.arrayOfSprites.length;

  const anchorIndex = game.arrayOfSprites.indexOf(anchor);
  if (anchorIndex >= 0 && anchor instanceof Buildable) {
    insertIndex = Math.min(insertIndex, anchorIndex + 1);
  }

  game.arrayOfSprites.splice(insertIndex, 0, sprite);
  return true;
}

function playPlacementSuccess(panel) {
  if (panel && typeof panel.playSfx === "function") panel.playSfx("SHOP_ITEM_PLACED");
}

function playPlacementFailure(panel) {
  if (panel && typeof panel.playSfx === "function") panel.playSfx("CANT_BUILD");
}

function canPlaceSelectedShopItem(panel, itemConfig, target) {
  if (!panel || !itemConfig) return false;
  if (!ShopPlaceableRegistry[itemConfig.id]) {
    panel.setMessage("This item cannot be placed yet.");
    playPlacementFailure(panel);
    return false;
  }
  if (!panel.canPlaceDuringCurrentPhase()) {
    panel.setMessage("Placement is only allowed during preparation or under attack.");
    playPlacementFailure(panel);
    return false;
  }
  if (panel.isRuntimePaused && panel.isRuntimePaused()) {
    panel.setMessage("Cannot place while on break.");
    playPlacementFailure(panel);
    return false;
  }
  if (!panel.isShopItemUnlocked(itemConfig.id)) {
    panel.setMessage(`${itemConfig.fullName} is locked.`);
    playPlacementFailure(panel);
    return false;
  }
  if (!panel.canAfford(itemConfig.cost)) {
    panel.setMessage(`Not enough gold for ${itemConfig.fullName}. Need ${itemConfig.cost}G.`);
    playPlacementFailure(panel);
    return false;
  }
  if (target && target.isMapTile && itemConfig.placement !== "grass") {
    panel.setMessage(`${itemConfig.fullName} needs a Buildable foundation.`);
    playPlacementFailure(panel);
    return false;
  }
  return true;
}
