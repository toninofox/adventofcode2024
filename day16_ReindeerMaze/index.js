const inputs = require('./input.js')

const parseInput = (rawInput) => rawInput.split(/\r?\n/).map((row) => row.split(""))

const rowColDirections = [
    [0, 1, ">"],
    [-1, 0, "^"],
    [0, -1, "<"],
    [1, 0, "v"],
]


const isValid = (row, col, rows,cols, maze) => {
    return row >= 0 && col >= 0 && row < rows && col < cols && [".","E"].includes(maze[row][col]);
}

const findPath = (row, col, maze, rows,cols, bestPath, currentPath, currentMaze = maze) => {

    const currentCost = calculateCost(currentPath)
    if(bestPath.cost && currentCost > bestPath.cost){
        return
    }
    if (maze[row][col] === "E") {
        
        if(bestPath.cost === 0 || currentCost < bestPath.cost){
            bestPath.cost = currentCost
            bestPath.path = currentPath
        }
        //console.log(currentMaze.map(row => row.join("")).join("\n"))
        return;
    }
    for (dr of rowColDirections) {
        const nextrow = row + dr[0];
        const nextcol = col + dr[1];

        if (isValid(nextrow, nextcol, rows,cols, maze)) {
            const originalValueDir = maze[nextrow][nextcol]
            currentMaze[row][col] = dr[2];
            currentPath += dr[2];

            findPath(nextrow, nextcol, maze, rows,cols, bestPath, currentPath, currentMaze);
            
            currentPath = currentPath.slice(0, -1);
            maze[nextrow][nextcol] = originalValueDir;
        }
    }
}

const calculateCost = path => path.split("").reduce((res, a, ix) =>  {
    return res += path[ix-1] === undefined ? 0 : a === path[ix-1] ? 1 : 1001
}, 0)


const sol1 = (input) => {
    const data = parseInput(input)
    const rows = data[0].length;
    const cols = data.length;
    const result = {cost:193700, path:""};
    let currentPath = ">";
    const initialCoords = data.reduce((res,row, rowIndex) => {
        row.forEach((col, colIndex) => {
            if(col === "S"){
                res.x =rowIndex
                res.y= colIndex
            }
            return    
        })       
            
        return res
    }, {x:0,y:0})
    findPath(initialCoords.x, initialCoords.y, data, rows,cols, result, currentPath);
   
    return result.cost
}

const sol2 = (input) => {
    const data = parseInput(input)



    return data
}

console.log(sol1(inputs.i2))
