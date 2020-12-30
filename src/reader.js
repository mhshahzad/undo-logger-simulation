const rl = require('readline');
const fs = require('fs');

module.exports = {
    getVariableValues : (string) => {
        const strArray = string.split(' ');
        return [ strArray[1], strArray[3] ]
    },
    readLineByLine: (path) => {
        const lineReader = rl.createInterface({
            input: fs.createReadStream(path)
        });
        lineReader.on('line',  (line) => {
        // write to log the start of transaction
            if (line.startsWith('READ')){
                this.handleReadAction(line);
            }
            if (line.startsWith('WRITE')){
                this.handleWriteAction(line);
            }
            if (line.startsWith('OUTPUT')){
                this.handleOutputAction(line);
            }
            if (line.startsWith('t:=')){
                this.handleOperations(line);
            }
            // on end write commit to log

        });
    },
    handleReadAction: (line) => {

    },
    handleWriteAction: (line) => {
    // copy value to buffer object
    // write to log
    },
    handleOutputAction: (line) => {
    // update variables and their values to file
    },
    handleOperations: (line) => {

    }
}