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

// const reader = require('./src/reader');
// const logger = require('./src/logger');
const {readLineByLine} = require("./src/reader");
const { readWithLineNum, readFile, getFirstLine, promptForLineNumber } = require('./src/services/utils');
const { getVariableValues } = require("./src/reader");

const app = async () => {
    const ACTIONS_FILE_PATH = './actions.txt'
    try {
        const data = await readWithLineNum(ACTIONS_FILE_PATH);
        console.log(data);
        const firstLine = await getFirstLine(ACTIONS_FILE_PATH);
        const [a, b] = getVariableValues(firstLine);
        console.log('Value of A:',a);
        console.log('Value of B:', b);
        const answer = await promptForLineNumber();
        console.log(readLineByLine(ACTIONS_FILE_PATH));

    } catch (e) {
        console.log(e)
    }
}

app();
