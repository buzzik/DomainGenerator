const got = require('got');
module.exports = class DomainChecker {
    constructor(secret, key) { //You need to provide GoDaddy api Key and Secret
        this.options = {
            headers: {
                accept: "application/json",
                Authorization: `sso-key ${key}:${secret}`
            },
            searchParams: {
                domain: '',
                checkType: 'FAST',
                forTransfer: 'false'
            }
        };
    }
    async checkDomain(domain) {
        this.options.searchParams.domain = domain;
        // const body = await got('https://api.godaddy.com/v1/domains/available', this.options).json();
        return got('https://api.godaddy.com/v1/domains/available', this.options).json();

    }
    async groupCheck(array, this.writeResult) {
        let results;
        for (const url of urls) {
            results = await checkDomain(url, results);
        }
        callback(result);
    }
    writeResult() {

    }
};