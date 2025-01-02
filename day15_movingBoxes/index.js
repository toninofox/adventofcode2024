const inputs = require('./input.js')

class Position {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    move(direction){
        this.x += direction.x
        this.y += direction.y
    }
}

const moveBigBox = (grid, leftBox, rightBox, direction) => {
    if(leftBox.canMove(grid,direction) && rightBox.canMove(grid,direction)){
        leftBox.move(grid,direction)
        rightBox.move(grid,direction)
    }
}


class Robot {
    place(position) {
        this.position = position
    }
    getSymbol() {
        return "@"
    }
    move(grid, direction){
        const newPosition = new Position(0,0)
        if(direction === "^"){            
            newPosition.y = -1            
        } else if(direction === "v"){
            newPosition.y = 1
        } else if(direction === "<"){
            newPosition.x = -1
        } else if(direction === ">"){
            newPosition.x = 1
        }
        const nextObject = grid[this.position.y + newPosition.y][this.position.x + newPosition.x]
        if(nextObject.canMove( grid, new Position(newPosition.x, newPosition.y))){
            grid[this.position.y][this.position.x] = new Empty()
            this.position.move(newPosition)
            nextObject.move(grid,newPosition)
            grid[this.position.y][this.position.x] = this
            
        }
    }
}

class Box {
    constructor(position){
        this.position = position
    }
    getSymbol() {
        return "O"
    }
    canMove(grid, direction){
        return grid[this.position.y + direction.y][this.position.x + direction.x].canMove(grid,direction)
    }

    move(grid, direction){
        const nextObj = grid[this.position.y + direction.y][this.position.x + direction.x]
        if(this.canMove(grid, direction)){
            this.position.move(direction)
            nextObj.move(grid,direction)
            grid[this.position.y][this.position.x] = this
        }
    }

    getPosition(){
        return this.position
    }

}


class BigBox {
    
    constructor(positions){
        this.positions = positions
        this.id = this.positions.map(p=>p.x + p.y).join("")
    }
    getId(){
        return this.id
    }
    getSymbol() {
        return "|"
    }

    canMove(grid, direction){
        if(direction.x === -1){ //left
            const leftPosition = this.positions[0]
            return grid[leftPosition.y + direction.y][leftPosition.x + direction.x].canMove(grid,direction)    
        } else if(direction.x !== 0){ //right
            const rightPosition = this.positions[1]
            return grid[rightPosition.y + direction.y][rightPosition.x + direction.x].canMove(grid,direction)    
        } else { //up/down
            return this.positions.every(position => grid[position.y + direction.y][position.x + direction.x].canMove(grid,direction))
        }
    }

    move(grid, direction){
        if(this.canMove(grid, direction)){
            if(direction.x === -1){ //left
                const leftPosition = this.positions[0]
                const nextObj = grid[leftPosition.y + direction.y][leftPosition.x + direction.x]
                
                nextObj.move(grid,direction)
                this.positions.forEach(position => {
                    position.move(direction)
                    grid[position.y][position.x] = this
                })
            } else if(direction.x === 1){ //right
                const rightPosition = this.positions[1]
                const nextObj = grid[rightPosition.y + direction.y][rightPosition.x + direction.x]
                nextObj.move(grid,direction)
                this.positions.forEach(position => {
                    position.move(direction)
                    grid[position.y][position.x] = this
                })
            } else { //up/down
                let objectMoved = []
                this.positions.forEach(position => {
                    const nextObj = grid[position.y + direction.y][position.x + direction.x]
                    const currPosition = new Position(position.x, position.y)
                    if(nextObj instanceof BigBox && !objectMoved.includes(nextObj.getId())){
                        nextObj.move(grid,direction)
                        objectMoved.push(nextObj.getId())
                    } else {
                        nextObj.move(grid,direction)
                    }
                        position.move(direction)
                        grid[position.y][position.x] = this
                        grid[currPosition.y][currPosition.x] = new Empty()
                })
            }
        }
    }

    getPosition(){
        return this.positions[0]
    }

}

class Wall {
    getSymbol() {
        return "#"        
    }
    canMove(){
        return false
    }
}

class Empty {
    getSymbol() {
        return "."
    }
    canMove(){
        return true
    }

    move(){
    }
}

const parseInput = (lines) => {
    const [grid, directions] = lines.split("\n\n")
    const grids = grid.split("\n")
    const room = Array(grids[0].length).fill().map(()=>Array(grids.length).fill())
    const robot = new Robot()
    grids.forEach((line, y) => {
        line.split("").map((c, x) => {
            if (c === "#") {
                room[y][x] = new Wall()
            } else if (c === "@") {
                room[y][x] = new Robot()
                robot.place(new Position(x, y))
            } else if (c === "O") {
                room[y][x] = new Box(new Position(x,y))
            } else if (c === ".") {
                room[y][x] = new Empty()
            } 
        })
    })
    return {room, robot,  directions: directions.split("\n").join("")}
}

const parseInputWide = (lines) => {
    const [grid, directions] = lines.split("\n\n")
    const grids = grid.split("\n")
    const room = Array(grids[0].length).fill().map(()=>Array(grids.length*2).fill())
    const robot = new Robot()
    grids.forEach((line, y) => {
        let increase = 0
        line.split("").forEach((c) => {
            const x = increase++
            const x2 = increase++
            if (c === "#") {
                room[y][x] = new Wall()
                room[y][x2] = new Wall()
            } else if (c === "@") {
                room[y][x] = new Robot()
                robot.place(new Position(x, y))
                room[y][x2] = new Empty()
            } else if (c === "O") {
                const box = new BigBox([new Position(x,y),new Position(x2,y)])
                room[y][x] = box
                room[y][x2] = box
            } else if (c === ".") {
                room[y][x] = new Empty()
                room[y][x2] = new Empty()
            } 
        })
    })
    return {room, robot,  directions: directions.split("\n").join("")}
}

const printRoom = room =>  console.log(room.map(row=>row.map(cell=>cell.getSymbol()).join("")).join("\n"))

const sol1 = (input) => {
    const context = parseInput(input)
    for(dir of context.directions){
        context.robot.move(context.room,dir)
    }
    return context.room.map(row=>row.filter(cell => cell instanceof Box)).flat().reduce((acc, box) => acc + (100 * box.getPosition().y + box.getPosition().x), 0)
}

const sol2 = (input, print) => {
    const context = parseInputWide(input)
    print && printRoom(context.room)
    for(dir of context.directions){
        print && console.log(dir)
        context.robot.move(context.room,dir)
        print && printRoom(context.room)

    }
    print && printRoom(context.room)
    return context.room.map(row=>row.filter(cell => cell instanceof BigBox)).flat().reduce((acc, box) => acc + (100 * box.getPosition().y + box.getPosition().x), 0)/2 //big boxes are counted twice

}

console.log(sol1(inputs.i2, false))
