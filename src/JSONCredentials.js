const fs = require('fs');
const prompt = require('prompt-sync')();
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

module.exports = class JSONCredentials {
  constructor(fields, filename) {
    this.fields = fields;
    this.JSONfile = filename || 'credentials.json';
    this._init();
  }
  async _init() {
    if (!fs.existsSync(this.JSONfile)) {
      return this._generateJSON();
    }
    return this._readJSON();
  }
  async _readJSON() {
    const credsFileData = await readFile(this.JSONfile);
    return JSON.parse(credsFileData);
  }
  _generateJSON() {
    let creds = {};
    for (const field of this.fields) {
      creds[field] = prompt(`${field}: `);
    }
    fs.appendFile(this.JSONfile, JSON.stringify(creds), (err) => {
      if (err) {
        throw err;
      }
    });
    return creds;
  }
};
