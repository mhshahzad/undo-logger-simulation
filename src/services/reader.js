const rl = require('readline');
const fs = require('fs');
const utils = require('./utils')
const logger = require("./logger");
const { writeVarFile } = require("./utils");

    const getVariableValues = (string) => {
        const strArray = string.split(' ');
        return [ strArray[1], strArray[3] ]
    }
    const handleFlushLog = async (logBuffer, logsFile) => {
        for (const val of logBuffer) {
            await logger.mainLogger(`${val}`, logsFile)
        }
    }
    const handleReadAction = async (varName, line, varsFilePath) => {
        // copy value to local variable t
        const fLine = await utils.getFirstLine(varsFilePath);
        const [a, b] = getVariableValues(fLine);
        if (varName === 'A'){
            return a;
        } else {
            return b;
        }
    }
    const handleWriteAction = async (name, val, buffer, logBuffer) => {
        // copy value to buffer object
        // write to local log
        console.log('entered');
        let newBuffer = JSON.parse(JSON.stringify(buffer));
        let newLogBuffer = JSON.parse(JSON.stringify(logBuffer));

        if (name === 'A'){
            newBuffer.push({
                varName: 'A',
                value: val
            });
            // await logger.mainLogger(`<T, A, ${val}>`)
            newLogBuffer.push(`<T, A, ${val}>`);
        }
        if (name === 'B'){
            newBuffer.push({
                varName: 'B',
                value: val
            });
            // await logger.mainLogger(`<T, B, ${val}>`)
            newLogBuffer.push(`<T, B, ${val}>`);
        }
        console.log(newLogBuffer);
        console.log(newBuffer);
        return [newBuffer, newLogBuffer];
    }
    const handleOutputAction = async (varName, buffer, filePath) => {
        // update variable values to file from buffer
        const result = buffer.filter(obj => {
            return obj.varName === varName
        });
        await writeVarFile(varName, result.value, filePath);
    }
    const handleOperations = (line, t) => {
        const checkMult = line.search(/\*/g);
        const checkAdd = line.search(/\+/g);
        if(checkMult !== -1 ){
            let val = line.substr(-1);
            let valInt = parseInt(val);
            return t * valInt;
        } else if(checkAdd !== -1){
            let val = line.substr(-1);
            let valInt = parseInt(val);
            return t + valInt;
        }
    }
    const readLineByLine = (noOfLines, actionsFiles, varsFile, logsFile) => {
        let t;
        let valBuffer = [];
        let logBuffer = [];
        let lineCount = 0;
        fs.readFile(actionsFiles, async (err, data) => {
            if(err) throw err;
            const array = data.toString().split("\n");
            for(let line in array) {
                lineCount++;
                if (lineCount === noOfLines){
                    return;
                }
                // write to log the start of transaction
                if (lineCount === 1){
                    await logger.mainLogger('Start T', logsFile);
                }
                if (line.startsWith('READ(A,t)')){
                    t = await handleReadAction('A',line, varsFile);
                }
                else if (line.startsWith('READ(B,t)')){
                    t = await handleReadAction('B',line, varsFile);
                }
                else if (line.startsWith('WRITE(A,t)')){
                    [newBuffer, newLogBuffer] = await handleWriteAction('A',t, valBuffer, logBuffer);
                }
                else if (line.startsWith('WRITE(B,t)')) {
                    [newBuffer, newLogBuffer] = await handleWriteAction('B', t, valBuffer, logBuffer);
                }
                else if (line.startsWith('OUTPUT(A)')){
                    await handleOutputAction('A', valBuffer, varsFile);
                }
                else if (line.startsWith('OUTPUT(B)')){
                    await handleOutputAction('B', valBuffer, varsFile);
                    await logger.mainLogger('COMMIT T', logsFile);
                }
                else if (line.startsWith('t:=')){
                    t = handleOperations(line, t);
                }
                else if (line.startsWith('flush')){
                    await handleFlushLog(logBuffer, logsFile);
                }
            }
        });
    }

    module.exports= {readLineByLine, getVariableValues}