const inputs = require('./input.js')
const _ = require('lodash')

const findFormula = (line) => [...line.matchAll(/mul\((?<first>\d+),(?<second>\d+)\)/g)].map(v=> ({first: _.toInteger(v.groups.first), second: _.toInteger(v.groups.second)}))

const sol1 = (input)=> {
    const formulas = findFormula(input)
    return formulas.reduce((acc,v)=> acc + (v.first * v.second),0)
}

const sol2 = (input)=> {
    const cleaned = input.replace(/(don't\(\).+?do\(\))/gs,"")
    const formulas = findFormula(cleaned)
    return formulas.reduce((acc,v)=> acc + (v.first * v.second),0)
}

console.log(sol2(inputs.i2))