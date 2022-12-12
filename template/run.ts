import { readFileSync } from "fs";

//xx:xx - xx:xx first part
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

inputStr.split("\n").map((line) => {});
