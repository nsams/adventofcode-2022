import { readFileSync } from "fs";

//8:05 - 8:16 second part

const inputStr = readFileSync("input.txt").toString();
//const inputStr = readFileSync("test-input.txt").toString();

function prettyPrint(i: any) {
    if (typeof i == "number") {
        return i;
    } else {
        return "[" + i.map((c: any) => prettyPrint(c)).join(",") + "]";
    }
}

function compare(left: any, right: any, indent = ""): boolean | undefined {
    if (typeof left == "number" && typeof right == "number") {
        console.log(indent + `- Compare ${left} vs ${right}`);
        if (left > right) {
            console.log(indent + "  - Right side is smaller, so inputs are not in the right order");
            return false;
        }
        if (left < right) {
            console.log(indent + "  - Left side is smaller, so inputs are in the right order ****");
            return true;
        }
        return undefined;
    } else if (Array.isArray(left) && Array.isArray(right)) {
        console.log(indent + `- Compare ${prettyPrint(left)} vs ${prettyPrint(right)}`);
        for (let i = 0; i < left.length; i++) {
            if (typeof right[i] === "undefined") {
                console.log(indent + "  - Right side ran out of items, so inputs are not in the right order");
                return false;
            }
            const r = compare(left[i], right[i], indent + "  ");
            if (typeof r !== "undefined") {
                return r;
            }
        }
        if (left.length == right.length) {
            return undefined;
        }

        console.log(indent + "  - Left side ran out of items, so inputs are in the right order ****");
        return true;
    } else if (!Array.isArray(left)) {
        console.log(indent + `- Mixed types; convert left to [${left}] and retry comparison`);
        return compare([left], right, indent + "");
    } else if (!Array.isArray(right)) {
        console.log(indent + `- Mixed types; convert right to [${right}] and retry comparison`);
        return compare(left, [right], indent + "");
    } else {
        throw new Error();
    }
}

const input = inputStr
    .replace(/\n\n/g, "\n")
    .split("\n")
    .map((line) => {
        return JSON.parse(line);
    });
input.push([[2]]);
input.push([[6]]);

const sortedInput = input.sort((a, b) => {
    if (compare(a, b)) {
        return -1;
    } else {
        return 1;
    }
});

let index1: number = -1;
let index2: number = -1;
let index = 0;
sortedInput.forEach((i) => {
    const line = prettyPrint(i);
    console.log(line);
    if (line == "[[2]]") {
        index1 = index + 1;
    }
    if (line == "[[6]]") {
        index2 = index + 1;
    }
    index++;
});

console.log(index1 * index2);
