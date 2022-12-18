import { readFileSync } from "fs";

const inputStr = readFileSync("input.txt").toString();
//const inputStr = readFileSync("test-input.txt").toString();
/*
const inputStr = `1,1,1
2,1,1`;
*/
const map: Record<number, Record<number, Record<number, true>>> = {};
const cubes: { x: number; y: number; z: number }[] = [];
let maxX = 10;
let maxY = 10;
let maxZ = 10;
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

for (let x = 0; x <= maxX + 1; x++) {
    for (let y = 0; y <= maxY + 1; y++) {
        for (let z = 0; z <= maxX + 1; z++) {}
    }
}

let visited: string[] = [];
let reachableMap: Record<number, Record<number, Record<number, boolean>>> = {};
function reachable(cube: { x: number; y: number; z: number }): boolean {
    visited.push([cube.x, cube.y, cube.z].join(","));
    //console.log(cube);
    if (reachableMap[cube.x] && reachableMap[cube.x][cube.y] && reachableMap[cube.x][cube.y][cube.z]) {
        return reachableMap[cube.x][cube.y][cube.z];
    }
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
        if (x < 0 || x > maxX || y < 0 || y > maxY || z < 0 || z > maxZ) {
            if (!reachableMap[x]) reachableMap[x] = {};
            if (!reachableMap[x][y]) reachableMap[x][y] = {};
            reachableMap[x][y][z] = true;
            //console.log(x, y, z);
            return true;
        }
        if (map[x] && map[x][y] && map[x][y][z]) {
            //blocked
        } else {
            //console.log("not blocked, recurse");
            if (!visited.includes([x, y, z].join(",")) && reachable({ x, y, z })) {
                if (!reachableMap[cube.x]) reachableMap[cube.x] = {};
                if (!reachableMap[cube.x][cube.y]) reachableMap[cube.x][cube.y] = {};
                reachableMap[cube.x][cube.y][cube.z] = true;
                return true;
            }
        }
    }
    if (!reachableMap[cube.x]) reachableMap[cube.x] = {};
    if (!reachableMap[cube.x][cube.y]) reachableMap[cube.x][cube.y] = {};
    reachableMap[cube.x][cube.y][cube.z] = false;
    return false;
}

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
            visited.length = 0;
            reachableMap = {};
            if (reachable({ x, y, z })) {
                exposedCount++;
            }
        }
    }
});
console.log(exposedCount);

console.log(reachable({ x: 2, y: 2, z: 5 }));
