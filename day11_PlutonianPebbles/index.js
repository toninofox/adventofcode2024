const inputs = require('./input.js')

const parseInput = (rawInput) => rawInput.split(" ").map(r => parseInt(r))

const blink = (value, cache) => {
    if (value === 0)
        return [1]
    if (value.toString().length % 2 === 0) {
        const stones = value.toString()
        return [Number(stones.slice(0, stones.length / 2)), Number(stones.slice(stones.length / 2))]
    }
    return [value * 2024]
}

const blinkWithDictionary = (stone, blinks, dict = {}) => {
    if (blinks === 0) {
        return 1
    }
    const key = `${stone.toString()}_${blinks}`
    if (dict[key] !== undefined) {
        return dict[key]
    }
    let result
    if (stone === 0) {
        result = blinkWithDictionary(1, blinks - 1, dict)
    } else if (stone.toString().length % 2 === 0) {
        const stones = stone.toString()
        const leftStoneBlinks = blinkWithDictionary(Number(stones.slice(0, stones.length / 2)), blinks - 1, dict)
        const rightStoneBlinks = blinkWithDictionary(Number(stones.slice(stones.length / 2)), blinks - 1, dict)
        result = leftStoneBlinks + rightStoneBlinks
    } else {
        result = blinkWithDictionary(2024 * stone, blinks - 1, dict)
    }
    dict[key] = result
    return result
}

const sol1 = (input) => {
    const data = parseInput(input)
    const numOfBlinks = 25
    let stones = data
    for (let i = 0; i < numOfBlinks; i++) {
        stones = [...stones.map(blink).flat()]
    }
    return stones.length
}

const sol2 = (input) => {
    const data = parseInput(input)
    const numOfBlinks = 75
    let stones = data
    let res = 0
    const dictionary = {}
    for (const stone of stones) {
        res += blinkWithDictionary(stone, numOfBlinks,dictionary)
    }
    return res
}

console.log(sol2(inputs.i2))
