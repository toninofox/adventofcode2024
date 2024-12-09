const inputs = require('./input.js')
const _ = require('lodash')

const findFormula = (line) => [...line.matchAll(/mul\((?<first>\d+),(?<second>\d+)\)/g)].map(v=> ({first: _.toInteger(v.groups.first), second: _.toInteger(v.groups.second)}))

const sol1 = (input)=> {
    const formulas = findFormula(input)
    return formulas.reduce((acc,v)=> acc + (v.first * v.second),0)
}

const sol2 = (input)=> {
    const i = parseInput(input)
    return i.reduce((acc,r) =>  isSafe(r.map(s=>_.toInteger(s)),1) ? acc + 1 : acc,0)
}

console.log(sol1(inputs.i2))