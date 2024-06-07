const crypto = require('node:crypto');

const generateToken = () => {
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');
    return { publicKey, privateKey };
};

module.exports = generateToken;
