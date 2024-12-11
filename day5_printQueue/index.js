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
      const sequence = data.updates[i]   
      const filteredRules = data.rules.filter(rule=>rule.some(r=>sequence.includes(r)))
      if(validSequence(sequence, filteredRules)){
         middleValidPageNumbers.push(getMiddleElement(sequence))
      }
   }
   return middleValidPageNumbers.reduce((partialSum, a) => _.toInteger(a) + partialSum, 0);
}

const rulesAsMap = rules => rules.reduce((acc,r)=> {
   acc[r[0]] = r[1]
    return acc
   },{})

const sortPages = (sequence, rulesMap) => 
  sequence.sort((a,b) => {
   if(rulesMap[b] === a){
      -1
   } else if(rulesMap[a] === b){
      return 1
   } else {
      return 0
   }
})

const sol2 = (input) => {
   const data = parseInput(input)
   const middleValidPageNumbers = []
   for (let i = 0; i < data.updates.length; i++) {    
      const sequence = data.updates[i]  
      const filteredRules = data.rules.filter(rule=>rule.some(r=>sequence.includes(r)))
      if(!validSequence(sequence,filteredRules)){
         sortPages(sequence,rulesAsMap(filteredRules))
         middleValidPageNumbers.push(getMiddleElement(sequence))
      }
   }
   return middleValidPageNumbers.reduce((partialSum, a) => _.toInteger(a) + partialSum, 0);
}
console.log(sol2(inputs.i2))

