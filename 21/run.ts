import { readFileSync } from "fs";

//xx:xx - xx:xx first part
//xx:xx - xx:xx second part

const inputStr = readFileSync("input.txt").toString();
//const inputStr = readFileSync("test-input.txt").toString();

function firstMatch(regex: RegExp, str: string) {
    const m = str.match(regex);
    if (!m) return undefined;
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

/*
dbpl: 5
cczh: sllz + lgvd
*/
const input = inputStr.split("\n").map((line) => {
    console.log(line);
    const m = matches(/([a-z]+): (.*)/, line);
    const value = firstMatch(/([0-9]+)/, m[1]);
    if (value) {
        return {
            name: m[0],
            value: parseInt(value),
        };
    } else {
        const m2 = matches(/([a-z]+) (.) ([a-z]+)/, m[1]);
        return {
            name: m[0],
            job: {
                first: m2[0],
                operation: m2[1],
                second: m2[2],
            },
        };
    }
});
console.log(input);

function getValue(name: string): number {
    const i = input.find((i) => i.name == name);
    if (!i) throw new Error("can't find input with name " + name);
    if (i.value) return i.value;
    if (!i.job) throw new Error();
    const first = getValue(i.job.first);
    const second = getValue(i.job.second);
    return eval(first + " " + i.job.operation + " " + second);
}
console.log(getValue("root"));
