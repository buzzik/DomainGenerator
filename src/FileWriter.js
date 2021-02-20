const { Console } = require('console');
const fs = require('fs');

module.exports = class FileWriter {
    constructor() {}
    createFile(name, ext) {
        name = name || 'checked';
        ext = ext || 'txt';
        let now = new Date();
        let resFileName = `./result/${now.getTime()}_${name}.${ext}`;
        fs.writeFile(resFileName, '', (err) => {
            if (err) throw err;
        });
        console.log(`File created`);
        return resFileName;
    }
    async writeArray(array, fileName, fields) {
        fields = fields || false;
        let path = this.createFile(fileName, "csv");
        let file = fs.createWriteStream(path);
        file.on('error', function(err) { Console.log(err) });
        let columnCaptions = "";
        if (fields) {
            for (const item of fields) {
                columnCaptions = columnCaptions + item + ",";
            }
            file.write(`${columnCaptions}\n`);
        }
        array.forEach(function(el) {
            let line = '';
            if (fields) {
                for (const n of fields) {
                    line = line + el[n] + ",";
                }
            } else {
                line = el;
            }
            file.write(`${line}\n`);
        });
        file.end();
        console.log(`Data writed to ${path}`);
        return path;
    }
};