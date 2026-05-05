class Button extends Sprite {
    constructor(x, y, width, height, text, onClick) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.onClick = onClick;
        this.isHovered = false;
    }

    update(arrayOfSprites, keys, mouse) {
        this.isHovered = this.isMouseOver(mouse);

        if (mouse.clicked && this.isHovered) {
            this.onClick();
            mouse.clicked = false; // Prevent multiple triggers
        }
    }

    isMouseOver(mouse) {
        if (mouse == undefined) return false;
        return (
            mouse.x >= this.x &&
            mouse.x <= this.x + this.width &&
            mouse.y >= this.y &&
            mouse.y <= this.y + this.height
        );
    }

    draw(ctx) {
    // Shadow (gives depth)
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // Gradient background
    let gradient = ctx.createLinearGradient(
        this.x, this.y,
        this.x, this.y + this.height
    );

    if (this.isHovered) {
        gradient.addColorStop(0, "#888");
        gradient.addColorStop(1, "#555");
    } else {
        gradient.addColorStop(0, "#555");
        gradient.addColorStop(1, "#222");
    }

    ctx.fillStyle = gradient;

    // Rounded rectangle
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 10);
    ctx.fill();

    ctx.restore();

    // Border
    ctx.strokeStyle = this.isHovered ? "#fff" : "#937d26";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Text
    ctx.fillStyle = "#fff";
    ctx.font = this.isHovered ? "bold 22px Arial" : "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        this.text,
        this.x + this.width / 2,
        this.y + this.height / 2
    );
}
}
