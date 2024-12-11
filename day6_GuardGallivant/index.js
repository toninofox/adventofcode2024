const inputs = require('./input.js')

const sum = ([x1, y1], [x2, y2]) => [x1 + x2, y1 + y2];
const areEqual = ([x1, y1], [x2, y2]) => x1 === x2 && y1 === y2;

const Up = [0, -1] ;
const Down = [0, 1] ;
const Left = [-1, 0] ;
const Right = [1, 0] ;

const rotateClockwise = ([x, y]) => [-y, x];
const rotateAnticlockwise = ([x, y]) => [y, -x];

const parseInput = (input) => {
    const obstructions = [];

    const width = input.indexOf('\n');
    const height = input.length / width - 1;
    const bounds = [width, height];

    let position = [0, 0];

    input.split('\n').forEach((line, y) => {
        [...line].forEach((character, x) => {
            switch (character) {
                case '#':
                    obstructions.push([x, y]);
                    break;
                case '^':
                    position = [x, y];
                    break;
            }
        });
    });

    return { obstructions, position, bounds };
};

const inBounds = (position, bounds) => {
    return position[0] >= 0 && position[0] < bounds[0] && position[1] >= 0 && position[1] < bounds[1];
};

const tracePath = (obstructions, startPosition, bounds) => {
    let heading = Up;
    let position = startPosition;
    let positions = []; 
    let collisions = []; 
    let index = 0
    do {
        if (!positions.find((p) => areEqual(p[0], position))) positions.push([position, heading]);

        let newPosition = sum(position, heading);
        let obstruction;
        if ((obstruction = obstructions.find((p) => areEqual(p, newPosition))) !== undefined) {
            collisions.push([heading, obstruction, index]);
            heading = rotateClockwise(heading);
            newPosition = sum(position, heading);
        }
        position = newPosition;
        index++;
    } while (inBounds(position, bounds));

    return { positions, collisions };
};

const tracePathP2 = (obstructions, startPosition, bounds) => {
    let heading = Up;
    let position = startPosition;
    let positions= []; 
    let collisions = []; 
    let index = 0
    do {
        positions.push([position, heading]);

        let newPosition = sum(position, heading);
        let obstruction;
        if ((obstruction = obstructions.find((p) => areEqual(p, newPosition))) !== undefined) {
            collisions.push([heading, obstruction, index]);
            heading = rotateClockwise(heading);
            index++;
            continue;
        }
        position = newPosition;
        index++;
    } while (inBounds(position, bounds));

    return { positions, collisions };
};

const part1 = (input) => {
    const { obstructions, position: startPosition, bounds } = parseInput(input);
    const { positions, collisions } = tracePath(obstructions, startPosition, bounds);

    return positions.length;
};


const part2 = (input) => {
    const { obstructions, position: startPosition, bounds } = parseInput(input);
    const { positions, collisions } = tracePathP2(obstructions, startPosition, bounds);
    const potentialPositions = []; 

    collisions.forEach(([collisionHeading, obstruction, index]) => {

        let check;
        const neededPathHeading = rotateAnticlockwise(collisionHeading);

        if (areEqual(collisionHeading, Up)) { 
            check = ( position, pathHeading ) =>
                areEqual(pathHeading,neededPathHeading) && position[0] === obstruction[0] && position[1] > obstruction[1];
        } else if (areEqual(collisionHeading, Down)) {
            check = ( position, pathHeading ) =>
                areEqual(pathHeading,neededPathHeading) && position[0] === obstruction[0] && position[1] < obstruction[1];
        } else if (areEqual(collisionHeading, Left)) {
            check = ( position, pathHeading ) =>
                areEqual(pathHeading,neededPathHeading) && position[0] > obstruction[0] && position[1] === obstruction[1];
        } else if (areEqual(collisionHeading, Right)) {
            check = ( position, pathHeading ) =>
                areEqual(pathHeading,neededPathHeading) && position[0] < obstruction[0] && position[1] === obstruction[1];
        }

        positions.slice(index).forEach(([position, pathHeading]) => {
            if (check(position, pathHeading)) {
                potentialPositions.push([position, pathHeading]);
            }
        });
    });
    
    return potentialPositions.length;
};

console.log(part2(inputs.i2))