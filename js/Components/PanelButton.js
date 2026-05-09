class PanelButton extends Sprite {
  constructor(x, y, width, height, text, onClick, options = {}) {
    super();

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.text = text;
    this.onClick = onClick;

    this.item = options.item || null;
    this.icon = options.icon || "";
    this.description = options.description || "";
    this.cost = options.cost ?? null;

    this.disabled = false;
    this.selected = false;
    this.hovered = false;

    this.style = options.style || {};
  }

  update(arrayOfSprites, keys, mouse) {
    this.hovered =
      mouse.x >= this.x &&
      mouse.x <= this.x + this.width &&
      mouse.y >= this.y &&
      mouse.y <= this.y + this.height;

    if (this.hovered && mouse.clicked && !this.disabled) {
      if (this.onClick) this.onClick();
      mouse.clicked = false;
    }

    return false;
  }

  draw(ctx) {
    ctx.save();

    const radius = 8;

    let fill = this.style.buttonFill || "#3b2a1d";
    let border = this.style.buttonBorder || "#c49a45";
    let textColor = this.style.textColor || "#ffffff";

    if (this.disabled) {
      fill = this.style.buttonDisabled || "#242424";
      border = "#555555";
      textColor = "#888888";
    } else if (this.selected) {
      fill = this.style.buttonSelected || "#73521f";
      border = "#ffd166";
    } else if (this.hovered) {
      fill = this.style.buttonHover || "#4b3625";
      border = "#ffd166";
    }

    const gradient = ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
    gradient.addColorStop(0, this.lighten(fill, 18));
    gradient.addColorStop(0.5, fill);
    gradient.addColorStop(1, this.darken(fill, 18));

    ctx.fillStyle = gradient;
    ctx.strokeStyle = border;
    ctx.lineWidth = this.selected ? 3 : 2;

    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(this.x, this.y, this.width, this.height, radius);
    } else {
      ctx.rect(this.x, this.y, this.width, this.height);
    }
    ctx.fill();
    ctx.stroke();

    // Inner shine line
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(this.x + 8, this.y + 6);
    ctx.lineTo(this.x + this.width - 8, this.y + 6);
    ctx.stroke();

    // Icon
    ctx.font = "bold 17px Arial";
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(this.icon, this.x + 10, this.y + 18);

    // Main text
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.x + this.width / 2 + 8, this.y + 18);

    // Description
    ctx.font = "11px Arial";
    ctx.fillStyle = this.disabled ? "#777777" : "#d6c8a5";
    ctx.fillText(this.description, this.x + this.width / 2, this.y + 36);

    // Cost
    if (this.cost !== null) {
      ctx.font = "bold 11px Arial";
      ctx.fillStyle = this.disabled ? "#ff7070" : "#ffd166";
      ctx.fillText(`${this.cost}G`, this.x + this.width / 2, this.y + 50);
    }

    ctx.restore();
  }

  lighten(hex, amount) {
    return this.adjustColor(hex, amount);
  }

  darken(hex, amount) {
    return this.adjustColor(hex, -amount);
  }

  adjustColor(hex, amount) {
    if (!hex || !hex.startsWith("#")) return hex;

    let color = hex.substring(1);

    if (color.length === 3) {
      color = color
        .split("")
        .map((c) => c + c)
        .join("");
    }

    const num = parseInt(color, 16);

    let r = (num >> 16) + amount;
    let g = ((num >> 8) & 0x00ff) + amount;
    let b = (num & 0x0000ff) + amount;

    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    return `rgb(${r}, ${g}, ${b})`;
  }
}