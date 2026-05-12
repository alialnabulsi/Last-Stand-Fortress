class Cell extends Sprite {
    constructor(x, y, width, height,isMapTile) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isMapTile = isMapTile;
    }

    render(ctx) {
        ctx.strokeStyle = "Red";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}