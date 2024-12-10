const inputs = require('./input.js')

const parseInput = (rawInput) => rawInput.split(/\r?\n/).map((row) => row.split(""))



const directions = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, -1],
    [-1, 1]
]
const invalidCoordinates = (nx, ny, matrix, word, rows, cols) => nx < 0 || ny < 0 || nx >= rows || ny >= cols || matrix[ny][nx] !== word[i]
const checkWord = (x, y, dx, dy, matrix, word, rows, cols) => {
    for (let i = 0; i < word.length; i++) {
        const nx = x + i * dx
        const ny = y + i * dy
        if (invalidCoordinates(nx, ny, matrix, word, rows, cols)) {
            return false
        }
    }
    return true
}

const sol1 = (input) => {
    let count = 0
    const word = "XMAS"
    const data = parseInput(input)

    const rows = data.length
    const cols = data[0].length

    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            for (const [dx, dy] of directions) {
                if (checkWord(x, y, dx, dy, data, word, rows, cols)) {
                    count++
                }
            }
        }
    }
    return count
}

const sol2 = (input) => {
    let count = 0
    const data = parseInput(input)

    const rows = data.length
    const cols = data[0].length
    for (let x = 1; x < rows - 1; x++) {
        for (let y = 1; y < cols - 1; y++) {
            if (data[x][y] === "A") {
                const tlbr =
                    (data[x - 1][y - 1] === "M" && data[x + 1][y + 1] === "S") ||
                    (data[x - 1][y - 1] === "S" && data[x + 1][y + 1] === "M")
                const trbl =
                    (data[x - 1][y + 1] === "M" && data[x + 1][y - 1] === "S") ||
                    (data[x - 1][y + 1] === "S" && data[x + 1][y - 1] === "M")
                if (tlbr && trbl) count++
            }
        }
    }
    return count
}

console.log(sol2(inputs.i2))