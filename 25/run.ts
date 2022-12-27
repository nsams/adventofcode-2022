import { readFileSync } from "fs";

const inputStr = readFileSync("input.txt").toString();
//const inputStr = readFileSync("test-input.txt").toString();

function snafuToDecimal(snafu: string): number {
    console.log("snafuToDecimal:", snafu);
    let ret = 0;
    const digits = [...snafu.matchAll(/([120\-=]?)/g)].map((i) => i[1]);
    digits.pop();
    digits.reverse();
    digits.forEach((digit, index) => {
        //console.log(digit, index, Math.pow(5, index));
        if (digit == "0") {
            ret += 0;
        } else if (digit == "1") {
            ret += Math.pow(5, index) * 1;
        } else if (digit == "2") {
            ret += Math.pow(5, index) * 2;
        } else if (digit == "-") {
            ret -= Math.pow(5, index) * 1;
        } else if (digit == "=") {
            ret -= Math.pow(5, index) * 2;
        }
    });
    return ret;
}

function decimalToSnafu(decimal: number): string {
    console.log("decimalToSnafu:", decimal);
    const digitsCount = Math.floor(Math.log(decimal) / Math.log(5));

    const digits: number[] = [];
    for (let digit = digitsCount; digit >= 0; digit--) {
        const exp = Math.pow(5, digit);
        const cur = Math.floor(decimal / exp);
        digits.push(cur);
        decimal -= Math.floor(decimal / Math.pow(5, digit)) * Math.pow(5, digit);
    }
    //console.log(digits);

    for (let i = digits.length - 1; i >= 0; i--) {
        //console.log(i, digits[i]);
        if (digits[i] == 3 || digits[i] == 4 || digits[i] == 5) {
            if (i == 0) {
                digits.unshift(1);
            } else {
                digits[i - 1]++;
            }
        }
    }
    //console.log(digits);
    let ret = "";
    for (let i = 0; i < digits.length; i++) {
        //console.log(i, digits[i]);
        const cur = digits[i];
        if (cur == 0 || cur == 1 || cur == 2) {
            ret += String(cur);
        } else if (cur == 3) {
            ret += "=";
        } else if (cur == 4) {
            ret += "-";
        } else if (cur == 5) {
            ret += "0";
        }
    }
    return ret;
}

function assert(snafu: string, decimal: number) {
    console.log("");

    const calculatedDecimal = snafuToDecimal(snafu);
    if (decimal != calculatedDecimal) {
        console.error("ERROR: " + snafu + " -> " + calculatedDecimal + " expected " + decimal);
    } else {
        console.error("OK: " + snafu + " -> " + calculatedDecimal);
    }

    const calculatedSnafu = decimalToSnafu(decimal);
    if (snafu != calculatedSnafu) {
        console.error("ERROR: " + decimal + " -> " + calculatedSnafu + " expected " + snafu);
    } else {
        console.error("OK: " + decimal + " -> " + calculatedSnafu);
    }
}
assert("1", 1);
assert("2", 2);
assert("1=", 3);
assert("1-", 4);
assert("10", 5);
assert("11", 6);
assert("12", 7);
assert("2=", 8);
assert("2-", 9);
assert("20", 10);
assert("1=0", 15);
assert("1-0", 20);
assert("1=11-2", 2022);
assert("1-0---0", 12345);
assert("1121-1110-1=0", 314159265);
assert("10-1", 121);

let sum = 0;
inputStr.split("\n").forEach((i) => {
    sum += snafuToDecimal(i);
});
console.log(decimalToSnafu(sum));
