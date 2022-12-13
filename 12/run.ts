import { readFileSync } from "fs";
import Graph from "node-dijkstra";

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

function findStart() {
    for (let y = 0; y < elevationMap.length; y++) {
        for (let x = 0; x < elevationMap[y].length; x++) {
            if (elevation({ x, y }) == "S") {
                return { x, y };
            }
        }
    }
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
const start = findStart()!;
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

const nodes: string[] = [];
const adjacencyList: Record<string, string[]> = {};
for (let y = 0; y < elevationMap.length; y++) {
    for (let x = 0; x < elevationMap[y].length; x++) {
        nodes.push(x + " " + y);
        adjacencyList[x + " " + y] = possibleMoves({ x, y }).map((i) => i.coordinates.x + " " + i.coordinates.y);
    }
}

const startNode = start.x + " " + start.y;
const stopNode = end.x + " " + end.y;

const route = new Graph();

for (const node of nodes) {
    route.addNode(
        node,
        adjacencyList[node].reduce((acc, i) => {
            acc[i] = 1;
            return acc;
        }, {} as Record<string, number>),
    );
}

const p = route.path(startNode, stopNode) as string[];
console.log("Try 1", p);
console.log("Try 1", p.length - 1);

// try 2
const visited = new Map<string, MovementGraph>();
class MovementGraph {
    public possibleMoves?: MovementGraph[];
    constructor(public move: Move, public step = 0, public parent: MovementGraph | null = null) {
        const key = move.coordinates.x + "," + move.coordinates.y;
        visited.set(key, this);
    }

    build() {
        console.log("building next step after step", this.step);
        this.possibleMoves = possibleMoves(this.move.coordinates)
            .filter((move) => {
                const key = move.coordinates.x + "," + move.coordinates.y;
                if (visited.has(key)) {
                    if (visited.get(key)!.step > this.step + 1) {
                        console.log("Step ", this.step, "visited already as step ", visited.get(key)!.step);
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
                    console.log("Try 2: Found E with steps", this.step - 1);
                }
                return new MovementGraph(m, this.step + 1, this);
            });
    }
}
const root = new MovementGraph({ direction: "start", coordinates: start });
let stack = [root];
while (stack.length > 0) {
    for (const i of stack) {
        i.build();
    }
    stack = stack.reduce((acc, i) => (acc = [...acc, ...i.possibleMoves!]), [] as MovementGraph[]);
}

console.log("done");

let pathNum = 0;
class Path {
    constructor(public moves: Move[]) {
        this.num = pathNum++;
    }
    num: number;
    stopped: false | string = false;
    reached = false;
}

function printPath(path: Path) {
    console.log("path #", path.num, path.moves.length + 1 + " steps", path.stopped ? "stopped: " + path.stopped : "");
    for (let y = 0; y < elevationMap.length; y++) {
        for (let x = 0; x < elevationMap[y].length; x++) {
            const index = path.moves.findIndex((m) => m.coordinates.x == x && m.coordinates.y == y);
            if (index != -1) {
                const move = path.moves[index + 1];
                if (move) {
                    process.stdout.write(move.direction == "down" ? "v" : move.direction == "up" ? "^" : move.direction == "right" ? ">" : "<");
                } else {
                    process.stdout.write("X");
                }
            } else if (end.x == x && end.y == y) {
                process.stdout.write("E");
            } else if (start.x == x && start.y == y) {
                const move = path.moves[0];
                if (move) {
                    process.stdout.write(move.direction == "down" ? "v" : move.direction == "up" ? "^" : move.direction == "right" ? ">" : "<");
                } else {
                    process.stdout.write("S");
                }
            } else {
                process.stdout.write(".");
            }
        }
        process.stdout.write("\n");
    }
    //console.log(path.moves);
    process.stdout.write("\n");
}

function main() {
    const paths: Array<Path> = possibleMoves(start).map((i) => new Path([i]));

    while (true) {
        for (const path of [...paths]) {
            if (path.stopped) continue;
            const lastMove = path.moves[path.moves.length - 1];

            const moves = possibleMoves(lastMove.coordinates).filter((move) => {
                //filter out recursions (visited in same path)
                return !path.moves.find((i) => i.coordinates.x == move.coordinates.x && i.coordinates.y == move.coordinates.y);
            });
            if (!moves.length) path.stopped = "no more moves found";

            function eventuallyStopPath(path: Path) {
                const lastMove = path.moves[path.moves.length - 1];
                if (elevation(lastMove.coordinates) == "E") {
                    //console.log("STOP E reached", path.moves);
                    //printPath(path);
                    path.stopped = "E reached";
                    path.reached = true;
                    return;
                }

                for (const innerPath of paths) {
                    if (innerPath === path) continue;
                    const innerPathMoveIndex = innerPath.moves.findIndex(
                        (i) => i.coordinates.x == lastMove.coordinates.x && i.coordinates.y == lastMove.coordinates.y,
                    );
                    if (innerPathMoveIndex != -1) {
                        //other path visited this
                        if (innerPathMoveIndex + 1 < path.moves.length) {
                            path.stopped = "other shorter path found: #" + innerPath.num;
                        } else {
                            innerPath.stopped = "other shorter path found: #" + path.num;
                        }
                    }
                }
            }
            //console.log("#", path.num, lastMove.coordinates, "moves", moves.length);
            for (let i = 1; i < moves.length; i++) {
                //console.log("new variant");
                const newPath = new Path([...path.moves, moves[i]]);
                eventuallyStopPath(newPath);
                //console.log("new variant #", newPath.num, moves[i].coordinates);
                paths.push(newPath);
                eventuallyStopPath(newPath);
            }
            if (moves.length > 0) {
                //console.log("append first to #", path.num, moves[0].coordinates);
                path.moves.push(moves[0]);
                eventuallyStopPath(path);
            }
        }
        //for (const path of paths) {
        //printPath(path);
        //}
        if (paths.every((p) => p.stopped)) {
            break;
        }
    }
    for (const path of paths.filter((p) => p.reached)) {
        console.log("Try 3");
        printPath(path);
    }
}

main();
