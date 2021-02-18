// const got = require('got');
const credentials = require('./credentials.js');
const DomainChecker = require('./src/DomainChecker.js');
checker = new DomainChecker(credentials.secret, credentials.key);
let res = checker.checkDomain('playddasrgfserfgesreceoubt.com');
res.then((r) => console.log(r));


// const options = {
//     hostname: 'api.godaddy.com',
//     port: 443,
//     path: 'api.godaddy.com/v1/domains/available?domain=playddasrgfserfgesreceoubt.com&checkType=FAST&forTransfer=false',
//     method: 'GET',
//     headers: {
//         "accept": "application/json",
//         "Authorization": "sso-key eogfNT2F93AX_9Ufmi2jPXivfnfbxfRdq8M:SYM9Bnjb8FN53vn35t9Tq"

//     }
// };

// const req = https.request(options, (res) => {
//     console.log('statusCode:', res.statusCode);
//     console.log('headers:', res.headers);

//     res.on('data', (d) => {
//         process.stdout.write(d);
//     });
// });

// req.on('error', (e) => {
//     console.error(e);
// });
// req.end();