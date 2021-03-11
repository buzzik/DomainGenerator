const prompt = require('prompt-sync')();
const DomainChecker = require('./src/domain-checker.js');
const DomainGenerator = require('./src/domain-generator.js');
const FileWriter = require('./src/file-writer.js');
const JSONCredentials = require('./src/json-credentials.js');
const generator = new DomainGenerator();
const exporter = new FileWriter();

generator.optMaxLength = prompt('Enter Max Length limit (8) : ', 8);
generator.optFirstPartLength = prompt('Enter first part Length  (flexible) : ');
generator.optDomainZone = prompt('Enter Domgitain Zone (com) : ', 'com');
generator.optTwoways = prompt('Try reverse concatination? y/n (n) : ', 'n');

(async () => {
  const rawArr = await generator.generate();
  const checkFlag = prompt('Check domains on GoDaddy? y/n (n) : ', 'n');
  let checkedArr = [];

  if (checkFlag === 'n') {
    console.log('Checking cancelled.');
    await exporter.writeArray(rawArr, 'unchecked');
    return exit();
  }
  const creds = new JSONCredentials(['key', 'secret']);
  const credentials = await creds.get();
  const checker = new DomainChecker(credentials.secret, credentials.key);
  try {
    checkedArr = await checker.groupCheck(rawArr);
  } catch (e) {
    const error = JSON.parse(e.response.body);
    if (error.message === 'Unauthorized : Could not authenticate API key/secret') {
      console.log(`${error.message}. You provided incorrect GoDaddy API credentials. Please fix it in credentials.json file, which are located if app directory.`);
    } else {
      console.log(e);
    }
    exit();
    return;
  }
  const fields = ['domain', 'available', 'price'];
  await exporter.writeArray(checkedArr, 'checked', fields);
  exit();
})();

function exit() {
  console.log('Press any key to exit');
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}
