/* jshint esversion: 8 */
const fs = require("fs");
const util = require("util");
const path = require("path");
const prompt = require('prompt-sync')();
const https = require('https');
const credentials = require('./credentials.js')

const firstPart = "input_1.txt";
const secondPart = "input_2.txt";

let maxLength = prompt(`Enter Max Length limit (8) :`, 8);
let firstPartLength = prompt(`Enter first part Length  (flexible) :`);
let secondPartLength = prompt(`Enter second part Length  (flexible) :`);
let domainZone = prompt(`Enter Domain Zone (.com) :`, '.com');
let twoWays = prompt(`Try both directions?(first+second and second+first) (y/n default n) :`, 'n');
let resArr = [];
let now = new Date();
let resFileName = `./result/result_${now.getTime()}.txt`;
fs.writeFile(resFileName, '', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
});

function readFiles(filepath, progress) {
    var data = fs.readFileSync(filepath, 'utf8');
    var content = util.format(data);
    let array = content.split(/\r?\n|\r/g);
    return array;
}

let firstArr = readFiles(firstPart);
let secondArr = readFiles(secondPart);

secondArr.forEach(secondPart => {
    if (secondPart.length < maxLength) {
        let allowedLength = maxLength - secondPart.length;
        for (const firstPart of firstArr) {
            if (firstPartLength && firstPartLength == firstPart.length || !firstPartLength && firstPart.length <= allowedLength) {
                resArr.push(capitalizeFirstLetter(firstPart) + capitalizeFirstLetter(secondPart) + domainZone);
                if (twoWays == "y") {
                    resArr.push(capitalizeFirstLetter(secondPart) + capitalizeFirstLetter(firstPart) + domainZone);
                }
            }
        }
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

resArr.forEach(function(domain) { getDomainInfo(domain); });

function getDomainInfo(domain) {
    const options = {
        hostname: 'api.godaddy.com',
        port: 443,
        path: `/v1/domains/available?domain=${domain}&checkType=FAST&forTransfer=false`,
        method: 'GET',
        headers: {
            "accept": "application/json",
            "Authorization": `sso-key ${credentials.key}:${credentials.secret}`
        }
    };
    const req = https.request(options, (res) => {
        // console.log('statusCode:', res.statusCode);
        // console.log('headers:', res.headers);

        res.on('data', (body) => {
            let fbResponse = JSON.parse(body);
            if (fbResponse.available) {
                fs.appendFile(resFileName, `${domain}\t ${fbResponse.price/1000000}\n`, (err) => {
                    if (err) throw err;
                    // console.log('The "data to append" was appended to file!');
                });
            }
        });
    });

    req.on('error', (e) => {
        console.error(e);
    });
    req.end();
}