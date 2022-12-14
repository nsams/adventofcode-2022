import { readFileSync } from "fs";

//9:05 - 9:45 first part
//xx:xx - xx:xx second part

const inputStr = readFileSync("input.txt").toString();
///const inputStr = readFileSync("test-input.txt").toString();

let maxX = 0;
let minX = Infinity;
let maxY = 0;
const input = inputStr.split("\n").map((line) => {
    return line.split(" -> ").map((coords) => {
        const [x, y] = coords.split(",");
        maxY = Math.max(parseInt(y), maxY);
        maxX = Math.max(parseInt(x), maxX);
        minX = Math.min(parseInt(x), minX);
        return {
            x: parseInt(x),
            y: parseInt(y),
        };
    });
});
maxY++;

const map: string[][] = [];
for (let x = 0; x <= maxX; x++) {
    map.push([]);
    for (let y = 0; y <= maxY; y++) {
        map[x].push(".");
    }
}
map[500][0] = "+";

input.forEach((line) => {
    let fromCoords = line[0];
    for (let i = 1; i < line.length; i++) {
        const toCoords = line[i];
        console.log(fromCoords, toCoords);
        if (fromCoords.x == toCoords.x) {
            //vertical
            if (fromCoords.y < toCoords.y) {
                for (let y = fromCoords.y; y <= toCoords.y; y++) {
                    map[fromCoords.x][y] = "#";
                }
            } else {
                for (let y = fromCoords.y; y >= toCoords.y; y--) {
                    map[fromCoords.x][y] = "#";
                }
            }
        } else if (fromCoords.y == toCoords.y) {
            //horizontal
            if (fromCoords.x < toCoords.x) {
                for (let x = fromCoords.x; x <= toCoords.x; x++) {
                    map[x][fromCoords.y] = "#";
                }
            } else {
                for (let x = fromCoords.x; x >= toCoords.x; x--) {
                    map[x][fromCoords.y] = "#";
                }
            }
        } else {
            throw new Error();
        }
        fromCoords = toCoords;
    }
});

function printMap() {
    for (let y = 0; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            process.stdout.write(map[x][y]);
        }
        process.stdout.write("\n");
    }
    process.stdout.write("\n");
}

printMap();

for (let sandCount = 1; ; sandCount++) {
    let x = 500;
    let y = 1;
    while (true) {
        if (map[x][y + 1] == ".") {
            y++;
        } else if (map[x - 1][y + 1] == "." /* && map[x - 1][y] == "."*/) {
            x--;
            y++;
        } else if (map[x + 1][y + 1] == "." /*&& map[x + 1][y] == "."*/) {
            x++;
            y++;
        } else {
            break;
        }
    }
    map[x][y] = "o";

    if (y >= maxY) {
        printMap();
        break;
    }

    console.log(sandCount);
    printMap();
}
