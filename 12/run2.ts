import { readFileSync } from "fs";

const inputStr = readFileSync("input.txt").toString();
//const inputStr = readFileSync("test-input.txt").toString();

const elevationMap = inputStr
    .trim()
    .split("\n")
    .map((line) => {
        return line.split("").map((el) => {
            if (el == "S" || el === "E") return el;
            return el.charCodeAt(0) - "a".charCodeAt(0);
        });
    });

type Coordinates = { x: number; y: number };
type Move = { direction: "start" | "up" | "down" | "left" | "right"; coordinates: Coordinates };
function elevation(p: Coordinates) {
    if (elevationMap[p.y] === undefined || elevationMap[p.y][p.x] === undefined) return undefined;
    return elevationMap[p.y][p.x];
}

function findPossibleStarts() {
    const ret: Coordinates[] = [];
    for (let y = 0; y < elevationMap.length; y++) {
        for (let x = 0; x < elevationMap[y].length; x++) {
            if (elevation({ x, y }) == 0) {
                ret.push({ x, y });
            }
        }
    }
    return ret;
}
function findEnd() {
    for (let y = 0; y < elevationMap.length; y++) {
        for (let x = 0; x < elevationMap[y].length; x++) {
            if (elevation({ x, y }) == "E") {
                return { x, y };
            }
        }
    }
}
const end = findEnd()!;

function possibleMoves(p: Coordinates) {
    function canMove(from: Coordinates, to: Coordinates) {
        const toElevation = elevation(to);
        if (toElevation === undefined) return false;
        const fromElevation = elevation(from)!;
        if (toElevation == "E" && fromElevation == 25 /*z*/) return true;
        if (toElevation == "E") return false;
        if (toElevation == "S") return false;
        if (fromElevation == "S" && toElevation != 0) return false;
        if (fromElevation == "S" || fromElevation == "E") return true;

        //return fromElevation >= toElevation - 1;
        return toElevation - fromElevation <= 1;
    }
    const ret: Move[] = [];
    if (canMove(p, { x: p.x, y: p.y - 1 })) {
        ret.push({ direction: "up", coordinates: { x: p.x, y: p.y - 1 } });
    }
    if (canMove(p, { x: p.x, y: p.y + 1 })) {
        ret.push({ direction: "down", coordinates: { x: p.x, y: p.y + 1 } });
    }
    if (canMove(p, { x: p.x - 1, y: p.y })) {
        ret.push({ direction: "left", coordinates: { x: p.x - 1, y: p.y } });
    }
    if (canMove(p, { x: p.x + 1, y: p.y })) {
        ret.push({ direction: "right", coordinates: { x: p.x + 1, y: p.y } });
    }
    return ret;
}
let result: MovementGraph | undefined;
const visited = new Map<string, MovementGraph>();
class MovementGraph {
    public possibleMoves?: MovementGraph[];
    constructor(public move: Move, public step = 0, public parent: MovementGraph | null = null) {
        const key = move.coordinates.x + "," + move.coordinates.y;
        visited.set(key, this);
    }

    build() {
        //console.log("building next step after step", this.step);
        this.possibleMoves = possibleMoves(this.move.coordinates)
            .filter((move) => {
                const key = move.coordinates.x + "," + move.coordinates.y;
                if (visited.has(key)) {
                    if (visited.get(key)!.step > this.step + 1) {
                        //console.log("Step ", this.step, "visited already as step ", visited.get(key)!.step);
                        //return true;
                    } else {
                        //return false;
                    }
                    return false;
                } else {
                    return true;
                }
            })
            .map((m) => {
                const el = elevation(m.coordinates);
                if (el == "E") {
                    result = this;
                    //console.log("Try 2: Found E with steps", this.step - 1);
                }
                return new MovementGraph(m, this.step + 1, this);
            });
    }
}

console.log(
    findPossibleStarts()
        .map((start) => {
            result = undefined;
            visited.clear();
            const root = new MovementGraph({ direction: "start", coordinates: start });
            //console.log(root);
            let stack = [root];
            while (stack.length > 0) {
                for (const i of stack) {
                    i.build();
                }
                stack = stack.reduce((acc, i) => (acc = [...acc, ...i.possibleMoves!]), [] as MovementGraph[]);
            }
            return (result as unknown as MovementGraph)?.step;
        })
        .filter((i) => i !== undefined)
        .sort((a, b) => a - b)[0] - 1,
);
