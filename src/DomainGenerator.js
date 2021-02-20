const util = require("util");
const fs = require("fs");
module.exports = class DomainGenerator {
    constructor() {
        this.inputFile1 = "input_1.txt";
        this.inputFile2 = "input_2.txt";
        this.optMaxLength = 6;
        this.optFirstPartLength = undefined;
        this.optDomainZone = ".com";
        this.optTwoways = "n";
        this.resArr = [];
        this.firstArr = [];
        this.secondArr = [];
        this.resFileName = "";
        this._counter = 0;
    }
    init() {
        this.firstArr = this.readFiles(this.inputFile1);
        this.secondArr = this.readFiles(this.inputFile2);
        this.mergeParts();
        console.log(`Generated ${this.resArr.length} domains.`);
        return this.resArr;
    }
    readFiles(filepath, progress) {
        var data = fs.readFileSync(filepath, "utf8");
        var content = util.format(data);
        let array = content.split(/\r?\n|\r/g);
        return array;
    }
    mergeParts() {
        this.secondArr.forEach((secondPart) => {
            if (secondPart.length < this.optMaxLength) {
                let allowedLength = this.optMaxLength - secondPart.length;
                for (const firstPart of this.firstArr) {
                    if ((this.optFirstPartLength && this.optFirstPartLength == firstPart.length) || (!this.optFirstPartLength && firstPart.length <= allowedLength)) {
                        this.resArr.push(`${capitalizeFirstLetter(firstPart)}${capitalizeFirstLetter(secondPart)}${this.optDomainZone}`);
                        if (this.optTwoways == "y") {
                            this.resArr.push(`${capitalizeFirstLetter(secondPart)}${capitalizeFirstLetter(firstPart)}${this.optDomainZone}`);
                        }
                    }
                }
            }
        });
    }
};

function capitalizeFirstLetter(string) {
    return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
}