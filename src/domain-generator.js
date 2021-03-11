const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
module.exports = class DomainGenerator {
  constructor() {
    this.inputFile1 = 'input_1.txt';
    this.inputFile2 = 'input_2.txt';
    this.optMaxLength = 6;
    this.optFirstPartLength = undefined;
    this.optDomainZone = 'com';
    this.optTwoways = 'n';
    this.resArr = [];
    this.firstArr = [];
    this.secondArr = [];
    this.resFileName = '';
    this._counter = 0;
  }

  async generate() {
    this.firstArr = await this._readFile(this.inputFile1);
    this.secondArr = await this._readFile(this.inputFile2);
    this._mergeParts();
    console.log(`Generated ${this.resArr.length} domains.`);
    return this.resArr;
  }

  async _readFile(filepath) {
    try {
      const data = await readFile(filepath, 'utf8');
      const content = util.format(data);
      const array = content.split(/\r?\n|\r/g);
      return array;
    } catch (error) {
      if (error) {
        throw error;
      }
    }
  }

  _mergeParts() {
    this.secondArr.forEach((secondPart) => {
      if (secondPart.length < this.optMaxLength) {
        const allowedLength = this.optMaxLength - secondPart.length;
        for (const firstPart of this.firstArr) {
          if ((this.optFirstPartLength && this.optFirstPartLength === firstPart.length) || (!this.optFirstPartLength && firstPart.length <= allowedLength)) {
            this.resArr.push(`${capitalizeFirstLetter(firstPart)}${capitalizeFirstLetter(secondPart)}.${this.optDomainZone}`);
            if (this.optTwoways === 'y') {
              this.resArr.push(`${capitalizeFirstLetter(secondPart)}${capitalizeFirstLetter(firstPart)}.${this.optDomainZone}`);
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
