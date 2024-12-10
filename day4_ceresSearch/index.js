const inputs = require('./input.js')


const toMatrix = word => word.split('\n').map(lines=>lines.split(""))
 
// check whether given cell (row, col) is a valid
// cell or not.
function isvalid(mat, row, col, prevRow, prevCol)
{
 
    const ROW = mat.length
    const COL = mat[0].length - 1
    // return true if row number and column number
    // is in range
    return (row >= 0) && (row < ROW) &&
        (col >= 0) && (col < COL) &&
        !(row == prevRow && col == prevCol);
}
 
// These arrays are used to get row and column
// numbers of 8 neighboursof a given cell
let rowNum=[0,0,1,-1, -1,1,-1,1];
let colNum=[1,-1,0,0, -1,1,-1,1];
const directionsX = [
    [0, 1],  [0, -1], [1, 0], [-1, 0], 
]
 const directionsO = [
 [-1, -1], [1, 1], [-1, 1], [1, -1]]
// A utility function to do DFS for a 2D boolean
// matrix. It only considers the 8 neighbours as
// adjacent vertices
function  DFS(mat, row, col, prevRow, prevCol, word, path, index, n, result,directions)
{
    // return if current character doesn't match with
    // the next character in the word
    if (index > n || mat[row][col] != word[index])
        return ;
   
    // append current character position to path
    
    path += (word[index]) + "(" + (row).toString()
            + ", " + (col).toString() + ") ";
   
    // current character matches with the last character
    // in the word
    if (index == n)
    {   
        result.push(path)
        return true
    }
   
    // Recur for all connected neighbours
    for (let k = 0; k < directions.length; ++k){
        if (isvalid(mat, row + directions[k][0], col + directions[k][1],
                    prevRow, prevCol)) {
   
            DFS(mat, row + directions[k][0], col + directions[k][1],
                row, col, word, path, index + 1, n, result,directions);
               
        }
    }
}
 
// The main function to find all occurrences of the
// word in a matrix
function findWords(mat)
{
    const word = "XMAS"
    const n = word.length-1
    const result = []
    // traverse through the all cells of given matrix
    for (let i = 0; i < mat.length; ++i) {
        for (let j = 0; j < mat[0].length; ++j) {
   
            // occurrence of first character in matrix
            if (mat[i][j] == word[0]) {
   
                // check and print if path exists
                DFS(mat, i, j, -1, -1, word, "", 0, n,result,directionsX);
                DFS(mat, i, j, -1, -1, word, "", 0, n,result,directionsO);
            }
        }
    }
    return result
}
 

const sol1 = (input)=> {
    return findWords(toMatrix(input));
}

const sol2 = (input)=> {
    const cleaned = input.replace(/(don't\(\).+?do\(\))/gs,"")
    const formulas = findFormula(cleaned)
    return formulas.reduce((acc,v)=> acc + (v.first * v.second),0)
}

console.log(sol1(inputs.i1))
