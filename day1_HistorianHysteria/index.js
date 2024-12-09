const inputs = require('./input.js')
const _ = require('lodash')
const parseInput = (input) => input.split("\n").map(p=>p.split(/\s+/)).reduce((acc,v, i)=>{
 
    acc.l[i] = v[0]
    acc.r[i] = v[1]
    return acc;
},{l:[],r:[]})

const sol1 = (input)=> {
    const i = parseInput(input)
    const l = i.l.sort()
    const r = i.r.sort()
    return l.reduce((acc,v,i) => acc += Math.abs(v-r[i]),0)
}

const sol2 = (input)=> {
    const i = parseInput(input)
    const l = _.groupBy(i.l.sort())
    const r = _.groupBy(i.r.sort())
    return Object.keys(l).reduce((acc,v) =>{
        const curr = r[v] ? r[v].length * v : 0
        return acc + curr * l[v].length
    },0)
}

console.log(sol2(inputs.i2))