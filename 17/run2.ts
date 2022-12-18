import { readFileSync } from "fs";

//xx:xx - xx:xx first part
//xx:xx - xx:xx second part

const jets = readFileSync("input.txt").toString().split("");
//const jets = readFileSync("test-input.txt").toString().split("");

class Shape {
    public map: boolean[][] = [];
    constructor(map: boolean[][]) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (!this.map[x]) this.map[x] = [];
                this.map[x][y] = map[y][x];
            }
        }
    }
    get height() {
        return this.map[0].length;
    }
    get width() {
        return this.map.length;
    }
}
class Chamber {
    public map: Record<number, Record<number, true>> = {};
    public rockNumberAtY: Record<number, number> = [];
    public height = 0;
    constructor() {}

    merge(shape: Shape, atX: number, atY: number, rockNumber: number) {
        for (let x = 0; x < shape.map.length; x++) {
            for (let y = 0; y < shape.map[x].length; y++) {
                if (shape.map[x][y]) {
                    if (!this.map[x + atX]) this.map[x + atX] = {};
                    this.map[x + atX][atY - y] = true;
                }
            }
        }
        this.height = Math.max(this.height, atY);
        this.rockNumberAtY[atY] = rockNumber;
    }
    intersects(shape: Shape, atX: number, atY: number) {
        for (let x = 0; x < shape.map.length; x++) {
            for (let y = 0; y < shape.map[x].length; y++) {
                if (shape.map[x][y] && this.map[x + atX] && this.map[x + atX][atY - y]) {
                    return true;
                }
            }
        }
        return false;
    }

    print(shape?: { shape: Shape; atX: number; atY: number }) {
        const height = Math.max(this.height, shape?.atY || 0);

        for (let y = height; y > 0; y--) {
            process.stdout.write(y + "|");
            for (let x = 0; x < 7; x++) {
                //console.log(x, y, x - atX, atY - y);
                if (this.map[x] && this.map[x][y]) {
                    process.stdout.write("#");
                } else if (shape && shape.shape.map[x - shape.atX] && shape.shape.map[x - shape.atX][shape.atY - y]) {
                    process.stdout.write("@");
                } else {
                    process.stdout.write(".");
                }
            }
            process.stdout.write("| ");
            let nr = 0;
            for (let x = 0; x < 7; x++) {
                if (this.map[x] && this.map[x][y]) {
                    nr += Math.pow(2, x); //TODO learn to use bit operations again
                }
            }
            //chamberLines += String.fromCharCode(nr);
            process.stdout.write("" + nr /* + " " + String.fromCharCode(nr)*/);
            if (this.rockNumberAtY[y]) process.stdout.write(" " + this.rockNumberAtY[y]);
            process.stdout.write("\n");
        }
        process.stdout.write("+-------+\n\n");
    }
}
const shapes = [
    new Shape([[true, true, true, true]]),
    new Shape([
        [false, true, false],
        [true, true, true],
        [false, true, false],
    ]),
    new Shape([
        [false, false, true],
        [false, false, true],
        [true, true, true],
    ]),
    new Shape([[true], [true], [true], [true]]),
    new Shape([
        [true, true],
        [true, true],
    ]),
];

function run(limit: number) {
    const debugRockNumber = -1;

    let rocksStopped = 0;
    let nextShapeNum = 0;
    let nextJetNum = 0;
    const chamber = new Chamber();
    while (true) {
        const shape = shapes[nextShapeNum];
        nextShapeNum++;
        if (nextShapeNum >= shapes.length) nextShapeNum = 0;

        let shapeX = 2;
        let shapeY = chamber.height + 3 + shape.height;

        if (rocksStopped == debugRockNumber) chamber.print({ shape, atX: shapeX, atY: shapeY });

        while (true) {
            //move left/right
            {
                let shapeXMoveOffset = 0;
                const jetDirection = jets[nextJetNum];
                nextJetNum++;
                if (nextJetNum >= jets.length) {
                    nextJetNum = 0;
                    //console.log("wrap jets");
                }
                if (jetDirection == ">") {
                    if (shapeX < 7 - shape.width) {
                        shapeXMoveOffset = +1;
                    }
                } else if (jetDirection == "<") {
                    if (shapeX > 0) {
                        shapeXMoveOffset = -1;
                    }
                }

                if (!chamber.intersects(shape, shapeX + shapeXMoveOffset, shapeY)) {
                    shapeX += shapeXMoveOffset;
                    //console.log("move", nextJetNum - 1, jetDirection);
                    //chamber.print({ shape, atX: shapeX, atY: shapeY });
                    if (rocksStopped == debugRockNumber) chamber.print({ shape, atX: shapeX, atY: shapeY });
                } else {
                    //console.log("don't move", nextJetNum - 1, jetDirection);
                }
            }

            //is blocked?
            {
                if (shapeY == shape.height) {
                    //console.log("floor reached", shapeY, shape.height);
                    chamber.merge(shape, shapeX, shapeY, rocksStopped + 1);
                    if (rocksStopped == debugRockNumber) chamber.print();
                    rocksStopped++;

                    break;
                }
                if (chamber.intersects(shape, shapeX, shapeY - 1)) {
                    //console.log("block reached (down)");
                    chamber.merge(shape, shapeX, shapeY, rocksStopped + 1);
                    if (rocksStopped == debugRockNumber) chamber.print();
                    rocksStopped++;
                    break;
                }
            }

            //fall down
            //console.log("fall down", shapeY, shape.height);
            shapeY--;
            if (rocksStopped == debugRockNumber) chamber.print({ shape, atX: shapeX, atY: shapeY });
        }
        //console.log(rocksStopped);
        if (rocksStopped >= limit) break;
        //if (rocksStopped >= 6) break;
    }
    return chamber;
}

//const numberOfRocks = 2022;
const numberOfRocks = 1000000000000;

const chamber = run(Math.min(10000, numberOfRocks));
chamber.print();

//convert to string for easier comparision (should have done everything with string)
let chamberLines = "";
for (let y = 1; y < chamber.height; y++) {
    let nr = 0;
    for (let x = 0; x < 7; x++) {
        if (chamber.map[x] && chamber.map[x][y]) {
            nr += Math.pow(2, x); //TODO learn to use bit operations again
        }
    }
    chamberLines += String.fromCharCode(nr);
}

//                        1
//              0123456789012345678
//chamberLines = "xyabcdefabcdefxyz";

let cycleLen = 0;
let cycleOffset = 0;
function findCycle() {
    for (let len = 5; len < Math.min(chamberLines.length, 10000); len++) {
        console.log("findCycle, checking len", len);
        for (let offset = 0; offset < 1000; offset++) {
            if (offset + len > chamberLines.length) break;
            const search =
                chamberLines.substring(offset, offset + len) +
                chamberLines.substring(offset, offset + len) +
                chamberLines.substring(offset, offset + len);
            //console.log(len, offset, search);
            if (chamberLines.indexOf(search, offset) !== -1 && chamber.rockNumberAtY[offset] && chamber.rockNumberAtY[offset + len]) {
                console.log("found cycle, len=", len, "offset=", offset);
                cycleLen = len;
                cycleOffset = offset;
                return;
            }
        }
    }
}
findCycle();

/*
const cycleLen = 2616;
const cycleOffset = 150;
*/

const cycleOffsetRocks = chamber.rockNumberAtY[cycleOffset];
const cycleLenRocks = chamber.rockNumberAtY[cycleOffset + cycleLen] - cycleOffsetRocks;
console.log("cycleLenRocks", cycleLenRocks, chamber.rockNumberAtY[cycleOffset + cycleLen], "-", cycleOffsetRocks);

//const cycleLenRocks = calcRocksByHeight(cycleOffset + cycleLen) - cycleOffsetRocks;
console.log("cycleOffsetRocks", cycleOffsetRocks, run(cycleOffsetRocks).height);
console.log("cycleOffsetRocks+cycleLenRocks", cycleOffsetRocks + cycleLenRocks, run(cycleOffsetRocks + cycleLenRocks).height);
console.log("cycleLenRocks", cycleLenRocks);

console.log("pre", cycleOffset, cycleOffsetRocks + " rocks", run(cycleOffsetRocks).height);
console.log("cycleLen", cycleLen, cycleLenRocks + " rocks");
const cycleCount = Math.floor((numberOfRocks - cycleOffsetRocks) / cycleLenRocks);
console.log("cycleCount", cycleCount);
const postRocks = (numberOfRocks - cycleOffsetRocks) % cycleLenRocks;
const post = run(cycleOffsetRocks + cycleLenRocks + postRocks).height - run(cycleOffsetRocks + cycleLenRocks).height;
console.log("postRocks", postRocks, post);
//const cycleCount = 57;
//console.log(">>>>", cycleOffsetRocks + );
console.log(">>>>>> RESULT", cycleOffset + cycleCount * cycleLen + post);
//console.log("should be", chamber.height);
