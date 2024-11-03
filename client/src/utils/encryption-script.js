// encryption-script.js
const CryptoJS = require('crypto-js');

const code = 'BokNq7emXT0f';
const secretKey = 'gameFinishCode'; // Use a secure key

const encryptedCode = CryptoJS.AES.encrypt(code, secretKey).toString();

console.log('Encrypted Code:', encryptedCode);
