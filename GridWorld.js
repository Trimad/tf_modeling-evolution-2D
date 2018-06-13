
/**
 * Takes in the number of rows, columns, and the size of each tile.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} resolution
 */
class GridWorld {
    constructor(rows, cols, resolution) {
        this.rows = rows;
        this.cols = cols;
        this.resolution = resolution;
        this.grid = [];
        this.creatures = [];

    }

    generate() {
        const inc = 0.2;
        let yOff = 0;
        for (let x = 0; x < this.rows; x++) {
            let xOff = 0;
            this.grid[x] = [];
            for (let y = 0; y < this.cols; y++) {
                let c = color(0, noise(xOff, yOff) * 255, 32);
                this.grid[x][y] = new Tile(x, y, this.resolution, c);
                if (x == 0 || y == 0 || x == this.rows - 1 || y == this.cols - 1) {
                    this.grid[x][y].obstacle = true;
                }
                xOff += inc;
            }
            yOff += inc;
        }
    }

    display() {
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                this.grid[x][y].display();
            }
        }
        for (let creature of this.creatures) {
            creature.display();
        }
    }

    spawnCreature(x, y, size) {
        this.creatures.push(new Creature(x, y, size));
    }

    animateCreatures() {
        for (let creature of this.creatures) {
            let vision = creature.look(this.grid);
            let thought = creature.think(vision);

            creature.moveX(thought[0], this.grid);
            creature.moveY(thought[1], this.grid);

        }
    }
}

/**
 * Takes in the x and y position of the Creature as well as its size.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} size
 */
class Creature {

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.offset = 0; //necessary when ellipseMode(CENTER);
        this.brain = new NeuralNetwork(6, 6, 2);
    }

    look(grid) {
        let direction = 0;
        let NESW = [true, true, true, true];
        //Look in every cardinal direction.

        let x = Math.floor(this.x);
        let px = x + 1;
        let mx = x - 1;

        let y = Math.floor(this.y);
        let py = y + 1;
        let my = y - 1;

        while (direction++ < 4) {
            switch (direction) {
                //North
                case 1:
                    if (this.y < 1)
                        NESW[direction - 2] = false;
                    break;
                //East
                case 2:
                    if (this.x > grid.length - 2)
                        NESW[direction - 1] = false;
                    break;
                //South
                case 3:
                    if (this.y > grid.length - 2)
                        NESW[direction - 1] = false;
                    break;
                //West
                case 4:
                    if (this.x < 2)
                        NESW[direction - 1] = false;
                    break;
                default:
                    break;
            }
        }
        //console.log(NESW);
        return NESW;
    }

    think(nesw) {
        let input = [this.x, this.y, nesw[0], nesw[1], nesw[2], nesw[3]];
        let thought = this.brain.predict(input);
        return thought;
    }

    moveX(dx, grid) {
        let dxNormal = map(dx, 0, 1, -1, 1);
        if (this.x + dxNormal > 0 && this.x + dxNormal < grid.length - 1) {
            this.x += dxNormal;
        }

    }

    moveY(dy, grid) {

        let dyNormal = map(dy, 0, 1, -1, 1);
        if (this.y + dyNormal > 0 && this.y + dyNormal < grid.length - 1) {
            this.y += dyNormal;
        }
    }

    display() {
        fill(Math.random() * 255);
        ellipse(this.x * this.size + this.offset, this.y * this.size + this.offset, this.size, this.size);
    }

}

/**
 * Takes in the x-position, y-position, size, and color of the tile.
 * @constructor
 * @param {number} x
 * @param {number} y
 * @param {number} size
 * @param {color} c
 */
class Tile {

    constructor(x, y, size, c) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.c = c;
        this.obstacle = false;
        this.offset = 0; //necessary when rectMode(CENTER);
    }

    display() {

        if (this.obstacle) {
            var to = color(255, 0, 0);
            fill(lerpColor(this.c, to, 0.5));
            rect(this.x * this.size + this.offset, this.y * this.size + this.offset, this.size, this.size);

        } else {
            fill(this.c);
            rect(this.x * this.size + this.offset, this.y * this.size + this.offset, this.size, this.size);
        }

    }

}