const {recovery} = require("./src/services/recovery");
const {promptForRecovery} = require("./src/services/utils");
const {LOG_FILE_PATH} = require("./src/constants");
const {VARS_FILE_PATH} = require("./src/constants");
const {ACTIONS_FILE_PATH} = require("./src/constants");
const { getVariableValues, readLineByLine } = require("./src/services/reader");
const { readWithLineNum,  getFirstLine, promptForLineNumber } = require('./src/services/utils');

const app = async () => {
    try {
        await readWithLineNum(ACTIONS_FILE_PATH).then(data => {
            console.log('========');
            console.log('STARTING');
            console.log('========');
            console.log('Actions to be performed:')
            console.log(data)
        });
        await getFirstLine(VARS_FILE_PATH).then((line)=>{
            const [a, b] = getVariableValues(line);
            console.log('Value of data element A on disk:',a);
            console.log('Value of data element B on disk:', b);
        });
        await promptForLineNumber().then((answer) => {
            readLineByLine(answer, ACTIONS_FILE_PATH, VARS_FILE_PATH, LOG_FILE_PATH);
        }).then(() => promptForRecovery())
            .then((answer) => {
                const check = answer.localeCompare('Y');
                if (check === 0){
                    recovery(LOG_FILE_PATH, VARS_FILE_PATH)
                }
            }).then(() => {
                    console.log('========');
                    console.log('FINISHED');
                    console.log('========');
                },
            )
    } catch (e) {
        console.log(e)
    }
}

app();
