/**
 * Module for creating/reading credentials data from JSON file.
 * It will check if the file with provided name exists and will return its data with an object.
 * If file does not exist, the user will be prompted to specify the required fields.
 * Then the provided data will be saved to a json file and returned to programm
 */
const fs = require('fs');
const prompt = require('prompt-sync')();
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
/**
 * Class for managing reading/creating json file with credentials
 */
class JSONCredentials {
  /**
   * Constructor
   * @param  {array} fields - list of fields that should present in credentials object
   * @param  {string} filename - names of file, it should contain .json extention
   */
  constructor(fields, filename) {
    this.fields = fields;
    this.JSONfile = filename;
  }
  /**
   * @return {object} - Data from .json file
   */
  async readJSON() {
    const credsFileData = await readFile(this.JSONfile);
    return JSON.parse(credsFileData);
  }

  /**
   * Prompts the user to specify each field provided to the class
   * @return  {object} - Specified fields
   */
  generateJSON() {
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
}
/**
 * A controller that receives parameters from the user and passes him a list of credentials.
 * @param  {array} fields
 * @param  {string} filename
 */
async function getCreds(fields, filename) {
  filename = filename || 'credentials.json'; // Default filename is credentials.json
  const creds = new JSONCredentials(fields, filename);
  if (!fs.existsSync(filename)) {
    console.log(`File ${filename} not found. Creating new with fields [ ${fields} ]`);
    return creds.generateJSON();
  }
  const result = await creds.readJSON();
  return result;
}

module.exports = { getCreds };
