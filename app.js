/*
Created by buzzik
https://github.com/buzzik/DomainGenerator/
*/
const path = require("path");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const prompt = require('prompt-sync')();
const got = require('got');
const DomainChecker = require('./src/DomainChecker.js');
const DomainGenerator = require('./src/DomainGenerator.js');
const FileWriter = require('./src/FileWriter.js');

const credsFilePath = './credentials.json';
const generator = new DomainGenerator();
const exporter = new FileWriter();
generator.optMaxLength = prompt(`Enter Max Length limit (8) : `, 8);
generator.optFirstPartLength = prompt(`Enter first part Length  (flexible) : `);
generator.optDomainZone = prompt(`Enter Domain Zone (com) : `, 'com');
generator.optTwoways = prompt(`Try reverse concatination? y/n (n) : `, 'n');

(async() => {
    let rawArr = generator.init();
    let checkFlag = prompt(`Check domains on GoDaddy? y/n (n) : `, 'n');
    let rusultFilePath;
    let checkedArr = [];


    if (checkFlag == "n") {
        console.log(`Checking cancelled.`);
        rusultFilePath = await exporter.writeArray(rawArr, "unchecked");
        exit();
        return;
    }
    if (!fs.existsSync(credsFilePath)) {
        console.log(`You need to provide GoDaddy API credentials to continue. Please go to https://developer.godaddy.com/keys and enter your key and secret.`)
        let key = prompt(`Key: `);
        let secret = prompt(`Secret: `);
        let creds = {
            key: key,
            secret: secret
        }
        let json = JSON.stringify(creds);
        fs.appendFile(credsFilePath, json, (err) => { if (err) { throw err; } });
    }
    const credsFileData = await readFile(credsFilePath);
    const credentials = JSON.parse(credsFileData);
    const checker = new DomainChecker(credentials.secret, credentials.key);
    try {
        checkedArr = await checker.groupCheck(rawArr);
    } catch (e) {
        let error = JSON.parse(e.response.body);
        if (error.message == "Unauthorized : Could not authenticate API key/secret") {
            console.log(`${error.message}. You provided incorrect GoDaddy API credentials. Please fix it in credentials.json file, which are located if app directory.`);
        } else {
            console.log(e);
        }
        // console.log(typeof e.response.body);
        exit();
        return;
    }
    let fields = ['domain', 'available', 'price'];
    rusultFilePath = await exporter.writeArray(checkedArr, 'checked', fields);
    exit();
})();

function exit() {
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}