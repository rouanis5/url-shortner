/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require('crypto');
const result = crypto.randomBytes(64).toString('hex');

console.log(result);
