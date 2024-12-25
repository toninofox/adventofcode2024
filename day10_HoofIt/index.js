const inputs = require('./input.js')

const parseInput = (rawInput) => rawInput.split(/\r?\n/).map((row) => row.split("").map(r=>parseInt(r)))



const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
]
const invalidCoordinates = (nx, ny, rows, cols) => nx < 0 || ny < 0 || nx >= rows || ny >= cols

const visitedLogic = visited => (x,y) => {
    const key = `${x},${y}`
    if (visited.has(key)){
        return true
    } 
    visited.add(key)
    return false
}

const ignoreVisitedLogic = (x,y) => false

const trailhead = (x, y, data, rows, cols, currVal, result, visited) => {
    if(visited(x,y)){
        return
    }
    if(currVal === 9){
        result.score++
        return
    }

    for (const [dx, dy] of directions) {
        const nx = x +  dx
        const ny = y +  dy
       
        if(!invalidCoordinates(nx,ny,rows,cols) && data[nx][ny] === currVal+1){
            result.matrix[nx][ny] = currVal+1
            trailhead(nx, ny, data, rows, cols, currVal + 1, result, visited)
            
        }
    }
}

const sol1 = (input) => {
    const data = parseInput(input)

    const rows = data.length
    const cols = data[0].length
    let totalScore = 0
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if(data[x][y] === 0){
                const result = { score: 0, matrix:Array(rows).fill("").map(()=>Array(cols).fill(""))}
                result.matrix[x][y] = 0
                trailhead(x, y, data, rows, cols,0,result, visitedLogic(new Set()))
                totalScore += result.score
            }
        }
    }
    return totalScore
}

const sol2 = (input) => {
    const data = parseInput(input)

    const rows = data.length
    const cols = data[0].length
    let totalScore = 0
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if(data[x][y] === 0){
                const result = { score: 0, matrix:Array(rows).fill("").map(()=>Array(cols).fill(""))}
                result.matrix[x][y] = 0
                trailhead(x, y, data, rows, cols,0,result, ignoreVisitedLogic)
                totalScore += result.score
            }
        }
    }
    return totalScore
}

console.log(sol2(inputs.i2))
