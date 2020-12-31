// take input txt file of actions to be performed
// show values of variables
// output the actions on screen with line numbers
// show menu to choose the failure point (line number) and start the transactions
// show actions with values updating on disk
// output txt file containing logs
// find the commit (searching for commit)
// read the log file show line reading (bottom up)
// commit found nothing to recover
// commit not found (set variables to old values) from logs
// output result

const {LOG_FILE_PATH} = require("./src/constants");
const {VARS_FILE_PATH} = require("./src/constants");
const {ACTIONS_FILE_PATH} = require("./src/constants");
const { getVariableValues, readLineByLine } = require("./src/services/reader");
const { readWithLineNum,  getFirstLine, promptForLineNumber } = require('./src/services/utils');


const app = async () => {

    try {
        await readWithLineNum(ACTIONS_FILE_PATH).then(data => console.log(data));
        await getFirstLine(VARS_FILE_PATH).then((line)=>{
            const [a, b] = getVariableValues(line);
            console.log('Value of A:',a);
            console.log('Value of B:', b);
        });
        await promptForLineNumber().then((answer)=>{
            readLineByLine(answer, ACTIONS_FILE_PATH, VARS_FILE_PATH, LOG_FILE_PATH);
        });
    } catch (e) {
        console.log(e)
    }
}

app();
