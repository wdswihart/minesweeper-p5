class Cell {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.isRevealed = false;
        this.isMarked = false;
        this.neighboringMines;
        this.hasMine = false;
        this.isExploded = false;
    }

    contains(x, y) {
        if (x >= this.x && x <= this.x + this.size) {
            if (y >= this.y && y <= this.y + this.size) {
                return true;
            }
        }
        return false;
    }

    drawText(str, r, g, b) {
        let s = this.size / 1.3;
        fill(r, g, b); 
        textSize(s);
        text(str, this.x + s / 2.5, this.y + s / 3.5, s, s);
    }

    show() {
        push();

        // Draw background.
        if (this.isRevealed && this.hasMine && this.isMarked) {
            fill(160, 160, 160);
        } else if (this.isRevealed && !this.hasMine) {
            fill(100, 100, 100);
        } else if (this.isMarked) {
            fill(160, 160, 160);
        } else {
            fill(200, 200, 200);
        }
        rect(this.x, this.y, this.size, this.size);

        // Draw overlay.
        if (this.isRevealed && this.hasMine) {
            if (this.isExploded) {
                let r = this.size;
                fill(255, 255, 0);
                ellipse(this.x + r / 2, this.y + r / 2, r);
                fill(255, 150, 0);
                ellipse(this.x + r / 2, this.y + r / 2, r / 1.5);
                fill(255, 0, 0);
                ellipse(this.x + r / 2, this.y + r / 2, r / 3);
            } else {
                let r = this.size / 2;
                fill(80, 80, 80);
                ellipse(this.x + r, this.y + r, r);
            }
        } else if (this.isRevealed) {
            if (this.neighboringMines != 0) {
                let mod = this.neighboringMines;
                this.drawText(this.neighboringMines, 255, 255 / mod, 0);
            }
        } 
        if (this.isMarked) {
            this.drawText('?', 0, 255, 0);
        }

        pop();
    }
}
