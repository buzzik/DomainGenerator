const { Console } = require('console');
const fs = require('fs');

module.exports = class FileWriter {
    constructor() {
        this.fileName = 'result';
    }
    createFile(name) {
        name = name ? name : 'result';
        let now = new Date();
        let resFileName = `./result/${now.getTime()}_${name}.txt`;
        fs.writeFile(resFileName, '', (err) => {
            if (err) throw err;
        });
        console.log(`File created`);
        return resFileName;
    }
    async writeArray(array, fileName) {
        let path = this.createFile(fileName);
        var file = fs.createWriteStream(path);
        file.on('error', function(err) { Console.log(err) });
        array.forEach(function(el) {
            file.write(`${el.domain}, ${el.available}, ${el.price}\n`);
        });
        file.end();
        console.log(`Data writed`);
    }
};