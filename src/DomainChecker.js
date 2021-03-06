const got = require('got');
const process = require('process');
module.exports = class DomainChecker {
  constructor(secret, key) {
    // You need to provide GoDaddy api Key and Secret
    this.options = {
      headers: {
        accept: 'application/json',
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

    return await got(
      'https://api.godaddy.com/v1/domains/available',
      this.options
    ).json();
  }

  async groupCheck(array, callback) {
    const results = [];
    let iterator = 0;
    for (const url of array) {
      const res = await this.checkDomain(url);
      results.push(res);
      iterator++;
      drawProgress(iterator, array.length);
      process.stdout.write(` ${url}`);
    }
    console.log('\nDone.');
    return results;
  }
};

function drawProgress(i, size) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Processing : ${size} / ${i}`);
}
