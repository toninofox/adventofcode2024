const inputs = require('./input.js')
const _ = require('lodash')
const parseInput = (input) => input.split("\n").map(p=>p.split(/\s+/))

const safeDiffs = [1,2,3]
const safeDiffsAsc = [-1,-2,-3]

const safeCheck = (report, isAscending) => {
    for (let i = 1; i < report.length; i++) {
        const diff = report[i] - report[i-1]
        const tolerateDiff = isAscending ? safeDiffs.includes(diff) : safeDiffsAsc.includes(diff)
        if(!tolerateDiff) {
            console.log(report, 'unsafe')
            return {safe:false, unsafeIndex:i}
        }
    }
    return {safe:true}
}

const removeDampener = (report, index,isAscending) => {
    const badReportPrev = [...report]
    const badReportCurr = [...report]
    badReportPrev.splice(index-1,1) 
    badReportCurr.splice(index,1) 
    const prevCheck = safeCheck(badReportPrev,isAscending) 
    return prevCheck.safe ? prevCheck : safeCheck(badReportCurr,isAscending) 
}

const isSafe = (report=[], maxTolerance=0) => {
    const isAscending = report[0] - report[report.length-1] < 0
    let prevResult = {}
    for (let i = 0; i <= maxTolerance && !prevResult.safe; i++) {
        if(i > 0){
            console.log('checking again')
            prevResult = removeDampener(report,prevResult.unsafeIndex,isAscending)
        } else {
            prevResult = safeCheck(report, isAscending)
        }
        
    }
    return prevResult.safe
}

const sol1 = (input)=> {
    const i = parseInput(input)
    return i.reduce((acc,r) =>  isSafe(r.map(s=>_.toInteger(s)),0) ? acc + 1 : acc,0)
}

const sol2 = (input)=> {
    const i = parseInput(input)
    return i.reduce((acc,r) =>  isSafe(r.map(s=>_.toInteger(s)),1) ? acc + 1 : acc,0)
}

console.log(sol2(inputs.i2))