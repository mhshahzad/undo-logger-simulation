
const {resolve} = require("path");

module.exports = {
    ACTIONS_FILE_PATH : resolve(__dirname, '../data/actions.txt'),
    LOG_FILE_PATH : resolve(__dirname, '../files/log.txt'),
    VARS_FILE_PATH : resolve(__dirname, '../data/variables.txt')
}
