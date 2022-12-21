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
    //console.log(line);
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

/*
V1 way to slow

console.log(input);
let humn = 50000;
function getValue(name: string): number {
    if (name == "humn") {
        return humn;
    }
    const i = input.find((i) => i.name == name);
    if (!i) throw new Error("can't find input with name " + name);
    if (i.value) return i.value;
    if (!i.job) throw new Error();
    const first = getValue(i.job.first);
    const second = getValue(i.job.second);
    if (name == "root") {
        if (first == second) {
            return 1;
        } else {
            return 0;
        }
    } else {
        return eval(first + " " + i.job.operation + " " + second);
    }
}
while (true) {
    console.log(humn);
    if (getValue("root")) {
        break;
    }
    humn++;
}
*/

/*
//v2, only one eval - better but still slow
let humn = 100000000;
function getValue(name: string): string {
    if (name == "humn") {
        return "$humn";
    }
    const i = input.find((i) => i.name == name);
    if (!i) throw new Error("can't find input with name " + name);
    if (i.value) return "" + i.value;
    if (!i.job) throw new Error();
    let first = getValue(i.job.first);
    let second = getValue(i.job.second);
    if (name == "root") {
        return `(${first}) == (${second}) ? 1 : 0`;
    } else {
        if (!first.includes("$humn")) first = eval(first);
        if (!second.includes("$humn")) second = eval(second);
        return "(" + first + ") " + i.job.operation + " (" + second + ")";
    }
}
const v = getValue("root");
console.log(v);

while (true) {
    console.log(humn);
    if (eval(v.replace("$humn", "" + humn))) {
        break;
    }
    humn++;
}
*/

//v3, fast and simple
function getValue(name: string): string | number {
    if (name == "humn") {
        return "$humn";
    }
    const i = input.find((i) => i.name == name);
    if (!i) throw new Error("can't find input with name " + name);
    if (i.value) return i.value;
    if (!i.job) throw new Error();
    let first = getValue(i.job.first);
    let second = getValue(i.job.second);
    if (name == "root") {
        return `(${first}) == (${second}) ? 1 : 0`;
    } else {
        const ret = "(" + first + ") " + i.job.operation + " (" + second + ")";
        if (!ret.includes("$humn")) return eval(ret);
        return ret;
    }
}

function getReversenValue(name: string, root: number): number {
    const i = input.find((i) => i.job?.first == name || i.job?.second == name);
    if (!i) throw new Error("can't find input with name " + name);
    if (i.value) return i.value;
    if (!i.job) throw new Error();
    console.log(i);
    if (i.name == "root") return root;
    if (i.job.operation == "+") {
        if (i.job.first == name) {
            //foo = humn + bar
            //humn = foo - bar
            return getReversenValue(i.name, root) - (getValue(i.job.second) as number);
        } else if (i.job.second == name) {
            //foo = bar + humn
            //humn = foo - bar
            return getReversenValue(i.name, root) - (getValue(i.job.first) as number);
        } else {
            throw new Error();
        }
    } else if (i.job.operation == "-") {
        if (i.job.first == name) {
            //foo = humn - bar
            //humn = foo + bar
            return getReversenValue(i.name, root) + (getValue(i.job.second) as number);
        } else if (i.job.second == name) {
            //foo = bar - humn
            //humn = bar - foo
            return (getValue(i.job.first) as number) - getReversenValue(i.name, root);
        } else {
            throw new Error();
        }
    } else if (i.job.operation == "*") {
        if (i.job.first == name) {
            //foo = humn * bar
            //humn = foo / bar
            return getReversenValue(i.name, root) / (getValue(i.job.second) as number);
        } else if (i.job.second == name) {
            //foo =  bar * humn
            //humn = foo / bar
            return getReversenValue(i.name, root) / (getValue(i.job.first) as number);
        } else {
            throw new Error();
        }
    } else if (i.job.operation == "/") {
        if (i.job.first == name) {
            //foo = humn / bar
            //humn = foo * bar
            return getReversenValue(i.name, root) * (getValue(i.job.second) as number);
        } else if (i.job.second == name) {
            //foo = bar / humn
            //humn * foo = bar
            //humn = bar / foo
            return (getValue(i.job.first) as number) / getReversenValue(i.name, root);
        } else {
            throw new Error();
        }
    } else {
        throw new Error();
    }
}

const root = input.find((i) => i.name == "root");
const rootFirst = getValue(root!.job!.first) as string;
const rootSecond = getValue(root!.job!.second) as number;

console.log(getReversenValue("humn", rootSecond));
