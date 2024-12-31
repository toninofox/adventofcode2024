const inputs = require('./input.js')

const parseInput = (lines) => lines.split("\n").map(line=>[...line.matchAll(/p=(?<px>-?\d+),(?<py>-?\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)/g)]
.map(v=> ({
    position: {x: Number(v.groups.px), y: Number(v.groups.py)},  
    velocity: {x: Number(v.groups.vx), y: Number(v.groups.vy)}
}))).flat()


const width = 101
const height = 103

const moveRobot = (robot) => {
    robot.position.x = (robot.position.x  + robot.velocity.x) % width
    robot.position.y = (robot.position.y  + robot.velocity.y) % height
}

const splitInQuadrant = (position,quadrants) => {
    const wMid = Math.floor(width/2)
    const hMid = Math.floor(height/2)
    quadrants.tr += position.x > wMid && position.y < hMid ? 1 : 0
    quadrants.tl += position.x < wMid && position.y < hMid ? 1 : 0
    quadrants.br += position.x > wMid && position.y > hMid ? 1 : 0
    quadrants.bl += position.x < wMid && position.y > hMid ? 1 : 0
}
const fixPositions = (robots) =>  robots.forEach(r=> {
    if(r.position.x < 0) {
        r.position.x = width + r.position.x
    }
    if(r.position.y < 0) {
        r.position.y = height + r.position.y
    }
    
    })
const print = (robots) => {
    let matrix = Array(width).fill().map(()=>Array(height).fill())

    robots.forEach(r=> {
        matrix[r.position.y] = matrix[r.position.y] || []
        matrix[r.position.y][r.position.x] = "1"
    })
    matrix.forEach(row=>{
        console.log(row.map(r=>r ? r : ".").join(""))
    })
}
const sol1 = (input) => {
    const robots = parseInput(input)
    const totalSeconds = 100
    for (let t = 1; t <= totalSeconds; t++) {
        robots.forEach(r=> moveRobot(r,t))
    }
    fixPositions(robots)
    const quadrants = {tl:0,tr:0,bl:0,br:0}
    robots.forEach(r=>splitInQuadrant(r.position,quadrants))
    return quadrants.tl * quadrants.tr * quadrants.bl * quadrants.br;
}

const isBound = (x,y,topLeft, bottomRight) => {
    return topLeft[0] <= x && bottomRight[0] > x && topLeft[1] <= y && bottomRight[1] > y;
  }

const robotsInTheMiddle = (robots) => robots.filter(r =>isBound(r.position.x, r.position.y, [Math.floor(width*0.25), Math.floor(height*0.25)], [Math.floor(width*0.75), Math.floor(height*0.75)]))

const sol2 = (input) => {
    const robots = parseInput(input)
    let totalSeconds = 0
    let positions = new Set();
    while(robotsInTheMiddle(robots).length < Math.floor(robots.length/2)) {      
        totalSeconds++
        positions = new Set();
        robots.forEach(r=> {
            moveRobot(r)
            positions.add(`${r.position.x},${r.position.y}`)
        })        

        fixPositions(robots)
    }
    
    print(robots)
    return totalSeconds;

}

console.log(sol2(inputs.i2))
