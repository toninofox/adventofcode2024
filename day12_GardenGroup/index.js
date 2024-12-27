const inputs = require('./input.js')

const parseInput = (rawInput) => rawInput.split(/\r?\n/).map((row) => row.split(""))

const colNeighbour = [
    [0, 1],
    [0, -1],
]
const rowNeighbour = [
    [1, 0],
    [-1, 0],
]

const rowColDirections = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
]

const diagonalsNeighbours = [
    [1, 1],
    [1, -1],
    [-1, -1],
    [-1, 1]
]
const invalidCoordinates = (nx, ny, rows, cols) => nx < 0 || ny < 0 || nx >= rows || ny >= cols

const visitedLogic = visited => (x, y) => {
    const key = `${x},${y}`
    if (visited.has(key)) {
        return true
    }
    visited.add(key)
    return false
}

const getNeighbours = (x, y, rows, cols) => {
    const neighbours = []
    for (const [dx, dy] of rowColDirections) {
        const nx = x + dx
        const ny = y + dy
        if (!invalidCoordinates(nx, ny, rows, cols)) {
            neighbours.push([nx, ny])
        }
    }
    return neighbours
}

const numOfNeighbour = (mat, x, y, rows, cols, plot, directions = rowColDirections) => {
    let count = 0;
    for (const [dx, dy] of directions) {
        const nx = x + dx
        const ny = y + dy
        if (!invalidCoordinates(nx, ny, rows, cols) && mat[nx][ny] === plot) {
            count++;
        }
    }
    return count;
}


const visitPlot = (data, x, y, rows, cols, region) => {
    region.visitedRegion(x, y)
    region.perimeter += 4 - numOfNeighbour(data, x, y, rows, cols, region.plot)
    region.area++
    visitNeighbours(data, x, y, rows, cols, region)
}
const visitNeighbours = (data, x, y, rows, cols, region) => {
    for ([nx, ny] of getNeighbours(x, y, rows, cols)) {
        if (data[nx][ny] !== region.plot) {
            continue
        }
        if (region.visitedRegion(nx, ny)) {
            continue
        }
        visitPlot(data, nx, ny, rows, cols, region)
    }
}

const findRegion = (data, x, y, rows, cols) => {
    const plot = data[x][y]

    const regionCache = new Set()
    const visitedRegion = visitedLogic(regionCache)

    const region = { plot, visitedRegion, perimeter: 0, area: 0, regionCache }

    visitPlot(data, x, y, rows, cols, region)
    return region
}

const findExternalCorners = (regionCoordinates) => {
    let corners = 0
    for (coordinate of regionCoordinates) {
        const [x, y] = coordinate.split(",").map(Number)
        for ([dx, dy] of diagonalsNeighbours) {

            if (!regionCoordinates.has(`${x + dx},${y}`) && !regionCoordinates.has(`${x},${y + dy}`)) {
                corners++
            }
            if (regionCoordinates.has(`${x + dx},${y}`) && regionCoordinates.has(`${x},${y + dy}`) && !regionCoordinates.has(`${x + dx},${y + dy}`)) {
                corners++
            }
        }

    }
    return corners
}

const sol1 = (input) => {
    const data = parseInput(input)

    const rows = data.length
    const cols = data[0].length
    const regions = []
    const cache = new Set()
    const visitedPlot = visitedLogic(cache)
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (visitedPlot(x, y)) {
                continue
            }
            const region = findRegion(data, x, y, rows, cols)
            region.regionCache.forEach(r => cache.add(r))
            regions.push(region)
        }
    }
    return regions.reduce((acc, r) => acc + (r.perimeter * r.area), 0)
}

const sol2 = (input) => {
    const data = parseInput(input)

    const rows = data.length
    const cols = data[0].length
    const regions = []
    const cache = new Set()
    const visitedPlot = visitedLogic(cache)
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (visitedPlot(x, y)) {
                continue
            }
            const region = findRegion(data, x, y, rows, cols)
            region.regionCache.forEach(r => cache.add(r))
            regions.push(region)
        }
    }

    for (r of regions) {
        r.corner = findExternalCorners(r.regionCache)
    }


    return regions.reduce((acc, r) => acc + (r.corner * r.area), 0)

}

console.log(sol2(inputs.i2))
