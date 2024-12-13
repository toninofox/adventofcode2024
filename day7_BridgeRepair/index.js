const inputs = require('./input.js')
const _ = require('lodash')

const parseInput = (line) => [...line.matchAll(/(?<total>\d+): (?<seq>.*)/g)]
.map(v=> ({
    total: _.toInteger(v.groups.total), 
    operands: v.groups.seq.split(" ").map(_.toInteger)
}))

const operations = {
    SUM: (a,b, expression) => ({ result: a+b, expression: expression= `${expression} + ${b}`   }),
    MUL: (a,b, expression) => ({ result: a*b, expression: expression= `${expression} * ${b}`   }),
    CONC: (a,b, expression) => ({ result: +(a+''+b), expression: expression= `${expression}${b}`  })
}
const checkResult = (result, values, operations, expression="", partial=0, ix=0) => {
    if(values[ix] === undefined) {
        const res = partial === result
        if(res){            
            console.log(expression.substring(3), result)
        }
        return res
    }
    const value = values[ix]
    const results = operations.map(o=> o(partial,value,expression))    
    ix++
    return results.some(r=> checkResult(result, values,operations, r.expression, r.result, ix))
}

const sol1 = (input) => {
    const data = parseInput(input);
    let total = 0
    for (const e of data) {
        if(checkResult(e.total,e.operands, [operations.SUM, operations.MUL])) {
            total += e.total
        }
    }
    return total 
}

const sol2 = (input) => {
    const data = parseInput(input);
    let total = 0
    for (const e of data) {
        if(checkResult(e.total,e.operands,[operations.SUM, operations.MUL, operations.CONC])) {
            total += e.total
        }
    }
    return total 
}


console.log(sol2(inputs.i2))