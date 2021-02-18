module.exports = class DomainChecker {
    constructor(secret, key) { //You need to provide GoDaddy api Key and Secret
        const options = {
            hostname: 'api.godaddy.com',
            port: 443,
            path: `/v1/domains/available?domain=${domain}&checkType=FAST&forTransfer=false`,
            method: 'GET',
            headers: {
                "accept": "application/json",
                "Authorization": `sso-key ${key}:${secret}`
            }
        };
    }
    checkDomain(domain) {
        const req = https.request(options, (res) => {
            // console.log('statusCode:', res.statusCode);
            // console.log('headers:', res.headers);
            res.on('data', (body) => {
                let fbResponse = JSON.parse(body);
                if (fbResponse.available) {
                    fs.appendFile(this.resFileName, `${domain}\t ${fbResponse.price/1000000}\n`, (err) => {
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
    groupCheck(array) {
        if (this._counter < array.length) {
            this.getDomainInfo(array[this._counter]);
            this._counter++;
        }
    }
};