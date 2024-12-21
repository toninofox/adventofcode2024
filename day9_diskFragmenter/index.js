const inputs = require('./input.js')

const parseInput = (line) => [...line.matchAll(/(?<odd>\d)(?<even>\d)?/g)]
.reduce((res,v)=> {
    if(v.groups.odd) {
        res.files.push(Number(v.groups.odd))
    }
    if(v.groups.even) {
        res.freeSpaces.push(Number(v.groups.even))
    }
    return res
},{files:[], freeSpaces:[]})

const getLastId = (array) => {
    let lastChar = array.pop()
    while(lastChar === ".") {
        lastChar = array.pop()
    }
    return lastChar
}

function getIds(data) {
    const ids = []
    for (let i = 0; i < data.files.length; i++) {
        ids[i] = Array(data.files[i]).fill(i)
    }
    return ids
}

function buildChecksum(data) {
    let checksum = []
    const ids = getIds(data)
    for (let i = 0; i < ids.length; i++) {
        checksum = [...checksum, ...ids[i]]
        if (data.freeSpaces[i]) {
            checksum = [...checksum, ...Array(data.freeSpaces[i]).fill(".")]
        }
    }
    return checksum
}


const sol1 = (input) => {
    const data = parseInput(input);
    const checksum = buildChecksum(data)
    for(let i=0;i<checksum.length;i++) {
        if(checksum[i] === ".") { 
            checksum[i] = getLastId(checksum)
        }
    }
    return checksum.reduce((sum,v,ix)=> sum + (ix * v),0)
}

const sol2 = (input) => {
    const data = parseInput(input);
    const ids = getIds(data)
    let checksum = []
    let currentFile = -1
    const processedIds = []
    for (let i = 0; i < ids.length; i++) {
        currentFile = ids[i][0]

        let freeSpaces = data.freeSpaces[i]
        if(!processedIds.includes(currentFile)) {
            checksum = [...checksum, ...ids[i]]
            processedIds.push(currentFile)
        } else {
            checksum = [...checksum, ...Array(ids[i].length).fill(0)]
        }
        let over = false
        while (freeSpaces !== undefined && freeSpaces > 0 && !over) {
            const remainingIds = ids.filter(id=> !processedIds.includes(id[0]))
            let nextFile = remainingIds.pop()
            while(nextFile !== undefined && nextFile.length > freeSpaces) {
                nextFile = remainingIds.pop()
            }
            if(nextFile !== undefined) {
                freeSpaces -= nextFile.length
                processedIds.push(nextFile[0])
                checksum = [...checksum, ...nextFile]
            } else {
                checksum = [...checksum, ...Array(freeSpaces).fill(0)]
                over = true
            }
        }
    }

    return checksum.reduce((sum,v,ix)=> sum + (ix * v),0)
}



console.log(sol2(inputs.i2))
