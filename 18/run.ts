import { readFileSync } from "fs";

const inputStr = readFileSync("input.txt").toString();
//const inputStr = readFileSync("test-input.txt").toString();
/*
const inputStr = `1,1,1
2,1,1`;
*/
const map: Record<number, Record<number, Record<number, true>>> = {};
const cubes: { x: number; y: number; z: number }[] = [];
let maxX = 0;
let maxY = 0;
let maxZ = 0;
inputStr.split("\n").map((line) => {
    const [x, y, z] = line.split(",").map((i) => parseInt(i));
    if (!map[x]) map[x] = {};
    if (!map[x][y]) map[x][y] = {};
    map[x][y][z] = true;
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxX, y);
    maxZ = Math.max(maxX, z);
    cubes.push({ x, y, z });
});

let exposedCount = 0;
cubes.forEach((cube) => {
    const offsets = [
        { x: +1, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
        { x: 0, y: +1, z: 0 },
        { x: 0, y: -1, z: 0 },
        { x: 0, y: 0, z: +1 },
        { x: 0, y: 0, z: -1 },
    ];
    for (const offset of offsets) {
        const x = cube.x + offset.x;
        const y = cube.y + offset.y;
        const z = cube.z + offset.z;
        if (map[x] && map[x][y] && map[x][y][z]) {
            //neibour found
        } else {
            exposedCount++;
        }
    }
});
console.log(exposedCount);
