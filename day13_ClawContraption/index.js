const inputs = require('./input.js')

const parseInput = (lines) => lines.split("\n\n").map(line=>[...line.matchAll(/Button A: X\+(?<ax>\d+), Y\+(?<ay>\d+)\s+Button B: X\+(?<bx>\d+), Y\+(?<by>\d+)\s+Prize: X=(?<priceX>\d+), Y=(?<priceY>\d+)/gm)]
.map(v=> ({
    a: {x: Number(v.groups.ax), y: Number(v.groups.ay)},  
    b: {x: Number(v.groups.bx), y: Number(v.groups.by)},
    price: {x: Number(v.groups.priceX), y: Number(v.groups.priceY)}
}))).flat()

const determinant = (first,second) => (first.x * second.y) - (first.y * second.x)
const cost = (nA, nB) => nA*3 + nB*1

const cramerRule = (a,b,price) => {
    const D = determinant(a, b)
    const Da = determinant(price, b)
    const Db = determinant(a, price)
    const numberOfA = Da / D
    const numberOfB = Db / D
    return {numberOfA, numberOfB}
}
const sol1 = (input) => {
    const data = parseInput(input)
    let totalCost = 0
    for (const d of data) {
        const {numberOfA, numberOfB} = cramerRule(d.a, d.b, d.price)
        const isPossible = numberOfA <= 100 && numberOfB <= 100 && Number.isInteger(numberOfA) && Number.isInteger(numberOfB)
        if(isPossible) {
            totalCost += cost(numberOfA, numberOfB)
        }
    }
    return totalCost;
}

const sol2 = (input) => {
    const data = parseInput(input)
    let totalCost = 0
    for (const d of data) {
        const newPrice = {x: d.price.x + 10000000000000, y: d.price.y + 10000000000000}
        const {numberOfA, numberOfB} = cramerRule(d.a, d.b, newPrice)
        const isPossible = Number.isInteger(numberOfA) && Number.isInteger(numberOfB)
        if(isPossible) {
            totalCost += cost(numberOfA, numberOfB)
        }
    }
    return totalCost;

}

console.log(sol2(inputs.i2))
