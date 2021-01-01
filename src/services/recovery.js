const fs = require('fs');
const {appendLogger} = require("./logger");
const {writeVarFile} = require("./utils");

const recovery = async (logFile, varsFile) => {
            let cT = /^COMMIT T\\r$/gm;
            let startT = /^START T\\r$/gm;
            let tA = /^<T, A, \d>\\r$/gm;
            let tB = /^<T, B, \d>\\r$/gm;
            fs.readFile(logFile, async (err, data) => {
                if (err) throw err;
                const array = data.toString().split("\n");
                    array.slice().reverse().some((v, i) => {
                        if(i === 0){
                            appendLogger('<ABORT T>', logFile);
                        }
                    if (v.startsWith('COMMIT')) {
                        return true;
                } else if (v.startsWith('<T, B')) {
                    // update value to variables file on disk
                         updateValsRecovery('B', v, varsFile);
                } else if (v.startsWith('<T, A')) {
                        // update value to variables file on disk
                         updateValsRecovery('A', v, varsFile);
                    }else if (v.startsWith('START')) {
                        return true;
                    }
            })
        })
}

const updateValsRecovery = async (varName, line, path) => {
    const val = line.match(/\d/g);
    await writeVarFile(varName, val[0], path);
}

module.exports={recovery}