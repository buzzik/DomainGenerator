/* jshint esversion: 8 */
const fs = require("fs");
const util = require("util");
const path = require("path");
const prompt = require('prompt-sync')();
const https = require('https');

const firstPart = "first.txt";
const secondPart = "second.txt";
const key = "3mM44UbCEpSXFQ_9MJwrgWvkNqCHn4z1d51Uw";
const secret = "65tpgsbXQvrWzB7NhihRVq";

// prompt.start();
// prompt.get(['username', 'email'], function(err, result) {
//     if (err) { return onErr(err); }
//     console.log('Command-line input received:');
//     console.log('  Username: ' + result.username);
//     console.log('  Email: ' + result.email);
// });

// function onErr(err) {
//     console.log(err);
//     return 1;
// }
let maxLength = prompt(`Enter Max Length limit (default 8) :`, 8);
let mainPartLength = prompt(`Enter Max Length limit (default 8) :`, 8);
let domainZone = prompt(`Enter Max Length limit (default 8) :`, 8);
let resArr = [];

function readFiles(filepath, progress) {
    var data = fs.readFileSync(filepath, 'utf8');
    var content = util.format(data);
    let array = content.split(/\r?\n|\r/g);
    return array;

}

let firstArr = readFiles(firstPart);
let secondArr = readFiles(secondPart);
// console.log(firstArr);
// console.log(secondArr);

secondArr.forEach(el => {
    if (el.length < maxLength) {
        let allowedLength = maxLength - el.length;
        for (const part of firstArr) {
            if (part.length <= allowedLength) {
                resArr.push(capitalizeFirstLetter(part) + capitalizeFirstLetter(el) + ".com");
            }
        }
    }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// console.log(resArr);
// fs.writeFileSync(resFile);
// let resCount = Math.ceil(resArr.length / 3000);
// console.log("resCount - " + resCount);
var file = fs.createWriteStream("result.txt");
resArr.forEach(function(v) { file.write(v + '\n'); });
// resArr.forEach(function(domain) { getDomainInfo(domain); });
file.on('error', function(err) { /* error handling */ });
file.end();



// function getDomainInfo(domain) {
//     const options = {
//         hostname: 'api.ote-godaddy.com',
//         port: 443,
//         path: `/v1/domains/available?domain=${domain}&checkType=FAST&forTransfer=false`,
//         method: 'GET',
//         headers: {
//             "accept": "application/json",
//             "Authorization": "sso-key 3mM44UbCEpSXFQ_9MJwrgWvkNqCHn4z1d51Uw:65tpgsbXQvrWzB7NhihRVq"
//         }
//     };
//     const req = https.request(options, (res) => {
//         // console.log('statusCode:', res.statusCode);
//         // console.log('headers:', res.headers);

//         res.on('data', (body) => {
//             var fbResponse = JSON.parse(body);
//             // console.log(`${domain} : ${fbResponse.available} : ${fbResponse.price}`);
//             // process.stdout.write(d);
//         });
//     });

//     req.on('error', (e) => {
//         console.error(e);
//     });
//     req.end();

// }



// for (let index = 0; index < resCount; index++) {
//     console.log("index - " + index);
//     var file = fs.createWriteStream("result_" + index + ".txt");
//     file.on('error', function(err) { /* error handling */ });
//     let startPoint = index * 3000;
//     console.log("startPoint - " + startPoint);
//     let endPoint = startPoint + 3000;
//     console.log("endPoint - " + endPoint);
//     for (let m = startPoint; m < endPoint; m++) {
//         // const element = array[index];
//         file.write(resArr[m] + '\n');
//         // console.log("m - " + m);
//     }
//     // resArr.forEach(function(v) { file.write(v + '\n'); });
//     file.end();

// }