const fs = require('fs');
const readline = require('readline');

module.exports = {
    writeVarFile : (varName, val, path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', function (err,data ) {
                let result;
                if (err) {
                    reject(err);
                }
                if (varName === 'A'){
                    result = data.replace(/[B]{1}\s\d{1}/gm, `B ${val}`);
                } else {
                    result = data.replace(/[B]{1}\s\d{1}/gm, `A ${val}`);
                }
                fs.writeFile(path, result, 'utf8', function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        })
    },
    readFile: async (path) => {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', function (err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    },
    readWithLineNum: (path) => {
        let counter = 0;
        let data = [];
        return new Promise((resolve, reject) => {
                readline.createInterface({
                    input: fs.createReadStream(path),
                    terminal: false
                }).on('line', (line) => {
                    counter++;
                    data.push(`Line:${counter} ` + line);
                }).on('close',() => {
                    resolve(data);
                }).on('SIGSTP',()=>{
                    reject();
                })
        })
    },
    getFirstLine: async (path) => {
        const readable = fs.createReadStream(path);
        const reader = readline.createInterface({ input: readable });
        const line = await new Promise((resolve) => {
            reader.on('line', (line) => {
                reader.close();
                resolve(line);
            });
        });
        readable.close();
        return line;
    },
    promptForLineNumber: () => {
        return new Promise((resolve, reject)=>{
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Choose the failure point by giving the line number as input: ', (answer) => {
                resolve(parseInt(answer));
                rl.close()
            });
        })
    }
}
