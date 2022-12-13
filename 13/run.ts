import { readFileSync } from "fs";

//7:41 - 8:05 first part

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

let result = 0;
let index = 0;
inputStr.split("\n\n").map((pair) => {
    console.log("== Pair " + (index + 1) + " ==");
    const [left, right] = pair.split("\n");
    const jsonLeft = JSON.parse(left);
    const jsonRight = JSON.parse(right);
    if (compare(jsonLeft, jsonRight) === true) {
        result += index + 1;
    }
    console.log("");
    index++;
});
console.log("sum ", result);
