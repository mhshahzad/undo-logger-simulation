const fs = require('fs');
const utils = require('./utils')
const logger = require("./logger");
const { writeVarFile } = require("./utils");

    const getVariableValues = (string) => {
        const strArray = string.split(' ');
        return [ strArray[1], strArray[3] ]
    }
    const handleFlushLog = async (logBuffer, logsFile) => {
        fs.readFile(logsFile, async (err, file) => {
            if(file.length === 0){
                for (const val of logBuffer) {
                    await logger.appendLogger(`${val}`, logsFile)
                }
            }else{
                new Promise((resolve, reject) => {
                    fs.writeFile(logsFile, '', ()=>{
                        const logger =  fs.createWriteStream(logsFile);
                        for (const val of logBuffer) {
                            logger.write(val + "\r\n");
                        }
                        resolve(logger.close());
                    });
                }).catch((e)=> console.log(e))
            }
        })

    }
    const handleReadAction = async (varName, varsFilePath) => {
        // copy value to local variable t
        const fLine = await utils.getFirstLine(varsFilePath);
        const [a, b] = getVariableValues(fLine);
        if (varName === 'A'){
            return a;
        } else {
            return b;
        }
    }
    const handleWriteAction = async (name, val, buffer, logBuffer, varsFile) => {
        // copy value to buffer object
        // write to local log
        let newBuffer = JSON.parse(JSON.stringify(buffer));
        let newLogBuffer = JSON.parse(JSON.stringify(logBuffer));

        if (name === 'A'){
            const oldVal = await handleReadAction(name, varsFile);
            newBuffer.push({
                varName: 'A',
                value: val
            });
            newLogBuffer.push(`<T, A, ${oldVal}>`);
        }
        if (name === 'B'){
            const oldVal = await handleReadAction(name, varsFile);
            newBuffer.push({
                varName: 'B',
                value: val
            });
            newLogBuffer.push(`<T, B, ${oldVal}>`);
        }
        return [newBuffer, newLogBuffer];
    }
    const handleOutputAction = async (varName, buffer, filePath) => {
        // update variable values to file from buffer
        const result = buffer.filter(obj => {
            return obj.varName === varName
        });
        await writeVarFile(varName, result[0].value, filePath);
    }
    const handleOperations = (line, t) => {
        let tParsed = parseInt(t);
        const checkMult = line.search(/\*/g);
        const checkAdd = line.search(/\+/g);
        if(checkMult !== -1 ){
            let val = line.substr(-1);
            let valInt = parseInt(val);
            return tParsed * valInt;
        } else if(checkAdd !== -1){
            let val = line.substr(-1);
            let valInt = parseInt(val);
            return tParsed + valInt;
        }
    }
    const readLineByLine = (noOfLines, actionsFiles, varsFile, logsFile) => {
        let t;
        let valBuffer = [];
        let logBuffer = [];
        let rA = /^READ\(A,t\)$/gm;
        let rB = /^READ\(B,t\)$/gm;
        let wA = /^WRITE\(A,t\)$/gm;
        let wB = /^WRITE\(B,t\)$/gm;
        let oA = /^OUTPUT\(A\)$/gm;
        let oB = /^OUTPUT\(B\)$/gm;
        fs.readFile(actionsFiles, async (err, data) => {
            if(err) throw err;
            const array = data.toString().split("\n");
            for (const v of array) {
                let i = array.indexOf(v);
                if (i === noOfLines){
                    break;
                }
                // write to log the start of transaction
                if (i === 0){
                    logBuffer.push('START T');
                }
                if (v.search(rA) !== -1){
                    t = await handleReadAction('A',varsFile);
                }
                else if (v.search(rB) !== -1){
                    t = await handleReadAction('B', varsFile);
                }
                else if (v.search(wA) !== -1){
                    [newBuffer, newLogBuffer] = await handleWriteAction('A',t, valBuffer, logBuffer, varsFile);
                    logBuffer = newLogBuffer;
                    valBuffer = newBuffer;
                }
                else if (v.search(wB) !== -1) {
                    [newBuffer, newLogBuffer] = await handleWriteAction('B', t, valBuffer, logBuffer, varsFile);
                    logBuffer = newLogBuffer;
                    valBuffer = newBuffer;
                }
                else if (v.search(oA) !== -1){
                    await handleOutputAction('A', valBuffer, varsFile);
                }
                else if (v.search(oB) !== -1){
                    await handleOutputAction('B', valBuffer, varsFile)
                        .then(() => logBuffer.push('COMMIT T'));
                }
                else if (v.startsWith('t:=')){
                    t = handleOperations(v, t);
                }
                else if (v.startsWith('flush')){
                    await handleFlushLog(logBuffer, logsFile);
                }
            }
        });
    }


    module.exports= { readLineByLine, getVariableValues }