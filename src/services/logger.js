const fs = require('fs');

module.exports = {
    mainLogger : (text, path) => {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, '', ()=>{
                const logger =  fs.createWriteStream(path);
                logger.write(text + "\r\n");
                resolve(logger.close());
            })
    }).catch((e)=> console.log(e))
    },
    appendLogger : (text, path) => {
        return new Promise((resolve, reject) => {
            const logger = fs.createWriteStream(path, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            logger.write(text + "\r\n");
            resolve(logger.close());
        }).catch((e)=> console.log(e))
    }
}