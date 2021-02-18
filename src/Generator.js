const fs = require("fs");
const util = require("util");
const path = require("path");
const prompt = require('prompt-sync')();
const https = require('https');

class DomainGenerator {
    constructor() {
        const firstPart = "input_1.txt";
        const secondPart = "input_2.txt";
        this.optMaxLength = 8;
        this.optFirstPartLength = undefined;
        // this.secondPartLength = prompt(`Enter second part Length  (flexible) :`); /not yet implemented
        this.optDomainZone = '.com';
        this.optTwoways = 'n';
        this.resArr = [];
        this.firstArr = [];
        this.secondArr = [];
        this.resFileName = "";
    }
    init() {
        this.optMaxLength = prompt(`Enter Max Length limit (8) :`, 8);
        this.optFirstPartLength = prompt(`Enter first part Length  (flexible) :`);
        // this.secondPartLength = prompt(`Enter second part Length  (flexible) :`); /not yet implemented
        this.optDomainZone = prompt(`Enter Domain Zone (.com) :`, '.com');
        this.optTwoways = prompt(`Try both directions?(first+second and second+first) (y/n default n) :`, 'n');
        let now = new Date();
        this.resFileName = `./result/result_${now.getTime()}.txt`;
        fs.writeFile(resFileName, '', (err) => {
            if (err) throw err;
            console.log('The file has been saved!');
        });
        this.firstArr = this.readFiles(firstPart);
        this.secondArr = this.readFiles(secondPart);
        this.resArr.forEach(function(domain) { getDomainInfo(domain); });
    }

    readFiles(filepath, progress) {
        var data = fs.readFileSync(filepath, 'utf8');
        var content = util.format(data);
        let array = content.split(/\r?\n|\r/g);
        return array;
    }
    mergeParts() {
        this.secondArr.forEach(secondPart => {
            if (secondPart.length < optMaxLength) {
                let allowedLength = optMaxLength - secondPart.length;
                for (const firstPart of this.firstArr) {
                    if (this.optFirstPartLength && this.optFirstPartLength == firstPart.length || !this.optFirstPartLength && firstPart.length <= allowedLength) {
                        this.resArr.push(capitalizeFirstLetter(firstPart) + capitalizeFirstLetter(secondPart) + optDomainZone);
                        if (optTwoways == "y") {
                            this.resArr.push(capitalizeFirstLetter(secondPart) + capitalizeFirstLetter(firstPart) + optDomainZone);
                        }
                    }
                }
            }
        });
    }
    getDomainInfo(domain) {
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
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = {
    DomainGenerator,
    init
}