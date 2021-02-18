const credentials = require('./credentials.js');
const fs = require("fs");
const util = require("util");
const path = require("path");
const prompt = require('prompt-sync')();
const https = require('https');
const process = require('process');
class DomainGenerator {
    constructor() {
        this.inputFile1 = "input_1.txt";
        this.inputFile2 = "input_2.txt";
        this.optMaxLength = 8;
        this.optFirstPartLength = undefined;
        // this.secondPartLength = undefined; //not yet implemented
        this.optDomainZone = '.com';
        this.optTwoways = 'n';
        this.resArr = [];
        this.firstArr = [];
        this.secondArr = [];
        this.resFileName = "";
        this._counter = 0;
    }
    init() {
        let now = new Date();
        this.resFileName = `./result/result_${now.getTime()}.txt`;
        fs.writeFile(this.resFileName, '', (err) => {
            if (err) throw err;
            console.log('\nThe file has been saved!');
        });
        this.firstArr = this.readFiles(this.inputFile1);
        this.secondArr = this.readFiles(this.inputFile2);
        this.mergeParts();
        // let self = this;
        // this.resArr.forEach(function(domain, i) {
        //     self.getDomainInfo(domain);

        // });
    }
    readFiles(filepath, progress) {
        var data = fs.readFileSync(filepath, 'utf8');
        var content = util.format(data);
        let array = content.split(/\r?\n|\r/g);
        return array;
    }
    mergeParts() {
        this.secondArr.forEach(secondPart => {
            if (secondPart.length < this.optMaxLength) {
                let allowedLength = this.optMaxLength - secondPart.length;
                for (const firstPart of this.firstArr) {
                    if (this.optFirstPartLength && this.optFirstPartLength == firstPart.length || !this.optFirstPartLength && firstPart.length <= allowedLength) {
                        this.resArr.push(capitalizeFirstLetter(firstPart) + capitalizeFirstLetter(secondPart) + this.optDomainZone);
                        if (this.optTwoways == "y") {
                            this.resArr.push(capitalizeFirstLetter(secondPart) + capitalizeFirstLetter(firstPart) + this.optDomainZone);
                        }
                    }
                }
            }
        });
    }
}

class DomainChecker {
    constructor() {

    }
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function drawProgress(i, size) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Processing : ${size} / ${i}`);
}

function processArray(array, iterator) {
    if (this._counter < array.length) {
        this.getDomainInfo(array[this._counter]);
        this._counter++;
    }
}
let Generator = new DomainGenerator();

Generator.optMaxLength = prompt(`Enter Max Length limit (8) :`, 8);
Generator.optFirstPartLength = prompt(`Enter first part Length  (flexible) :`);
Generator.optDomainZone = prompt(`Enter Domain Zone (.com) :`, '.com');
Generator.optTwoways = prompt(`Try both directions?(first+second and second+first) (y/n default n) :`, 'n');

Generator.init();