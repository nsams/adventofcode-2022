//7:25 -- ca. 8:00 erste runde
//8:40 -- 9:11
const inputStr = `Monkey 0:
Starting items: 59, 65, 86, 56, 74, 57, 56
Operation: new = old * 17
Test: divisible by 3
  If true: throw to monkey 3
  If false: throw to monkey 6

Monkey 1:
Starting items: 63, 83, 50, 63, 56
Operation: new = old + 2
Test: divisible by 13
  If true: throw to monkey 3
  If false: throw to monkey 0

Monkey 2:
Starting items: 93, 79, 74, 55
Operation: new = old + 1
Test: divisible by 2
  If true: throw to monkey 0
  If false: throw to monkey 1

Monkey 3:
Starting items: 86, 61, 67, 88, 94, 69, 56, 91
Operation: new = old + 7
Test: divisible by 11
  If true: throw to monkey 6
  If false: throw to monkey 7

Monkey 4:
Starting items: 76, 50, 51
Operation: new = old * old
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 5

Monkey 5:
Starting items: 77, 76
Operation: new = old + 8
Test: divisible by 17
  If true: throw to monkey 2
  If false: throw to monkey 1

Monkey 6:
Starting items: 74
Operation: new = old * 2
Test: divisible by 5
  If true: throw to monkey 4
  If false: throw to monkey 7

Monkey 7:
Starting items: 86, 85, 52, 86, 91, 95
Operation: new = old + 6
Test: divisible by 7
  If true: throw to monkey 4
  If false: throw to monkey 5`;

const testInputStr = `Monkey 0:
Starting items: 79, 98
Operation: new = old * 19
Test: divisible by 23
  If true: throw to monkey 2
  If false: throw to monkey 3

Monkey 1:
Starting items: 54, 65, 75, 74
Operation: new = old + 6
Test: divisible by 19
  If true: throw to monkey 2
  If false: throw to monkey 0

Monkey 2:
Starting items: 79, 60, 97
Operation: new = old * old
Test: divisible by 13
  If true: throw to monkey 1
  If false: throw to monkey 3

Monkey 3:
Starting items: 74
Operation: new = old + 3
Test: divisible by 17
  If true: throw to monkey 0
  If false: throw to monkey 1`;

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

class Item {
    public value: number;
    constructor(public initialValue: number) {
        this.value = this.initialValue;
    }

    operations: Array<{ operator: string; argument: "old" | number }> = [];
    modulo(m: number) {
        let v = this.initialValue;
        for (const operation of this.operations) {
            const argument = operation.argument === "old" ? v : operation.argument;
            if (operation.operator == "+") {
                v = ((v % m) + (argument % m)) % m;
            } else if (operation.operator == "*") {
                v = ((v % m) * (argument % m)) % m;
            }
        }
        return v;
    }
}

const monkeys = inputStr.split("\n\n").map((str) => {
    const lines = str.split("\n");
    const startingItems = firstMatch(/Starting items: (.*)/, lines[1])
        .split(", ")
        .map((i) => parseInt(i));

    const [operator, argument] = matches(/Operation: new = old (.) (.*)/, lines[2]);
    const test = parseInt(firstMatch(/Test: divisible by (.*)/, lines[3]));
    const ifTrue = parseInt(firstMatch(/If true: throw to monkey (.*)/, lines[4]));
    const ifFalse = parseInt(firstMatch(/If false: throw to monkey (.*)/, lines[5]));
    return {
        name: lines[0],
        items: startingItems.map((i) => new Item(i)),
        operation: {
            operator,
            argument: (argument === "old" ? "old" : parseInt(argument)) as "old" | number,
        },
        test,
        ifTrue,
        ifFalse,
        inspectCount: 0,
    };
});
//console.log(monkeys);
/*
(a + b) * c % m
((a+b) % m * c % m) % m
( (a%m+b%m)%m * c % m) % m
*/

for (let round = 0; round < 10000; round++) {
    if (round % 100 == 0) console.log("round", round + 1);
    for (const monkey of monkeys) {
        //console.log(monkey.name);
        monkey.items.map((item) => {
            //console.log(`  Monkey inspects an item with a worry level of ${item}.`);

            item.operations.push(monkey.operation);
            /*
            const argument = monkey.operation.argument === "old" ? item.value : monkey.operation.argument;
            if (monkey.operation.operator == "+") {
                item.value += argument;
                //  console.log(`    Worry level increases by ${monkey.operation.argument} to ${item}.`);
            } else if (monkey.operation.operator == "*") {
                item.value *= argument;
                //console.log(`    Worry level is multiplied by ${monkey.operation.argument} to ${item}.`);
            }

            if (item.modulo(monkey.test) !== item.value % monkey.test) {
                console.log(monkey.test, item);
                throw new Error();
            }
*/
            //item /= 3;
            //item = Math.floor(item);
            //console.log(`    Monkey gets bored with item. Worry level is divided by 3 to ${item}.`);
            if (item.modulo(monkey.test) === 0) {
                //  console.log(`    Current worry level is divisible by ${monkey.test}.`);
                monkeys[monkey.ifTrue].items.push(item);
                //console.log(`    Item with worry level ${item} is thrown to monkey ${monkey.ifTrue}.`);
            } else {
                //console.log(`    Current worry level is not divisible by ${monkey.test}.`);
                monkeys[monkey.ifFalse].items.push(item);
                //console.log(`    Item with worry level ${item} is thrown to monkey ${monkey.ifFalse}.`);
            }
            monkey.inspectCount++;
        });
        monkey.items = [];
    }
    //console.log(`After round ${round + 1}, the monkeys are holding items with these worry levels:`);
    for (const monkey of monkeys) {
        //console.log(`${monkey.name} ${monkey.items.join(", ")}`);
    }
    //console.log("");
}
for (const monkey of monkeys) {
    console.log(`${monkey.name} inspected items ${monkey.inspectCount} items.`);
}
