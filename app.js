const credentials = require('./credentials.js');
const path = require("path");
const prompt = require('prompt-sync')();
const got = require('got');
const DomainChecker = require('./src/DomainChecker.js');
const DomainGenerator = require('./src/DomainGenerator.js');
const FileWriter = require('./src/FileWriter.js');

const generator = new DomainGenerator();
const checker = new DomainChecker(credentials.secret, credentials.key);
const exporter = new FileWriter();


generator.optMaxLength = prompt(`Enter Max Length limit (8) :`, 8);
generator.optFirstPartLength = prompt(`Enter first part Length  (flexible) :`);
generator.optDomainZone = prompt(`Enter Domain Zone (.com) :`, '.com');
generator.optTwoways = prompt(`Try both directions?(first+second and second+first) (y/n default n) :`, 'n');

try {
    let rawArr = generator.init();
    let checkedArr = checker.groupCheck(rawArr);
    checkedArr.then((result) => {
        exporter.writeArray(result);
    });
} catch (e) {
    console.log(e);
}