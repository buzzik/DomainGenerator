const fs = require('fs');
const prompt = require('prompt-sync')();
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

module.exports = class JSONCredentials {
  constructor(fields, filename) {
    this.fields = fields;
    this.JSONfile = filename || 'credentials.json';
  }
  async get() {
    if (!fs.existsSync(this.JSONfile)) {
      return this._generateJSON();
    }
    const result = await this._readJSON();
    return result;
  }
  async _readJSON() {
    const credsFileData = await readFile(this.JSONfile);
    return JSON.parse(credsFileData);
  }
  _generateJSON() {
    const creds = {};
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
