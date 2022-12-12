import { readFileSync } from "fs";

//7:55 - 8:15 first part (incomplete)
//xx:xx - xx:xx second part

//const inputStr = readFileSync("input.txt").toString();
const inputStr = readFileSync("test-input.txt").toString();

function firstMatch(regex: RegExp, str: string) {
    const m = str.match(regex);
    if (!m) throw new Error("No Match");
    return m[1];
}
function matches(regex: RegExp, str: string) {
    const m = str.match(regex);
    if (!m) throw new Error("No Match");
    const ret: Array<string> = [];
    let i = 1;
    while (m[i] !== undefined) {
        ret.push(m[i]);
        i++;
    }
    return ret;
}

const elevationMap = inputStr.split("\n").map((line) => {
    return line.split("").map((el) => {
        if (el == "S" || el === "E") return el;
        return el.charCodeAt(0) - "a".charCodeAt(0);
    });
});

type Coordinates = { x: number; y: number };
function elevation(p: Coordinates) {
    if (!elevationMap[p.y] || !elevationMap[p.y][p.x]) return undefined;
    return elevationMap[p.y][p.x];
}

function findStart() {
    for (let y = 0; y < elevationMap.length; y++) {
        for (let x = 0; x < elevationMap[y].length; x++) {
            if (elevation({ x, y }) == "S") {
                return { x, y };
            }
        }
    }
}

function possibleMoves(p: Coordinates) {
    function canMove(from: Coordinates, to: Coordinates) {
        const toElevation = elevation(to);
        if (!toElevation) return false;
        const fromElevation = elevation(from)!;
        if (toElevation == "E") return true;
        if (toElevation == "S") return false;
        if (fromElevation == "S" || fromElevation == "E") return true;
        return fromElevation <= toElevation - 1;
    }
    const ret: Coordinates[] = [];
    if (canMove(p, { x: p.x, y: p.y - 1 })) {
        ret.push({ x: p.x, y: p.y - 1 });
    } else if (canMove(p, { x: p.x, y: p.y + 1 })) {
        ret.push({ x: p.x, y: p.y + 1 });
    } else if (canMove(p, { x: p.x - 1, y: p.y })) {
        ret.push({ x: p.x - 1, y: p.y });
    } else if (canMove(p, { x: p.x + 1, y: p.y })) {
        ret.push({ x: p.x + 1, y: p.y });
    }
    return ret;
}

function main() {
    const paths: Array<Coordinates[]> = [[findStart()!]];
    while (true) {
        for (const path of paths) {
            if (elevation(path[path.length]) == "E") break;
            for (const newCoord of possibleMoves(path[path.length - 1])) {
                if (path.find((i) => i.x == newCoord.x && i.y == newCoord.y)) {
                    //stop here, avoid recursion
                } else {
                    paths.push([...path, newCoord]);
                }
            }
        }
    }
}
main();
