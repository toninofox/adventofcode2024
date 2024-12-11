const inputs = require('./input.js')
const _ = require("lodash")

const parseInput = (rawInput) => {
    const sections = rawInput.split(/\n\n/)
    return {
        rules: sections[0].split("\n").map(o=>o.split("|")), 
        updates:sections[1].split("\n").map(u=>u.split(","))
     }
}

const getMiddleElement = pages => pages[Math.floor((pages.length - 1) / 2)];

const validSequence = (update, rules) => {
   const pages = [...update]
   while(pages.length) {
      const currentPage = pages.splice(0, 1)
      const invalidRules = pages.filter(nextPage => rules.some(r => r[0] === nextPage && r[1] === currentPage[0]))
      if (invalidRules.length) {
         return false
      }
   }
  return true
}

const sol1 = (input) => {
   const data = parseInput(input)
   const middleValidPageNumbers = []
   for (let i = 0; i < data.updates.length; i++) {    
    if(validSequence(data.updates[i], data.rules)){
      middleValidPageNumbers.push(getMiddleElement(data.updates[i]))
    }
   }
   return middleValidPageNumbers.reduce((partialSum, a) => _.toInteger(a) + partialSum, 0);
}

const sol2 = (input) => {
}

console.log(sol1(inputs.i2))

