const crypto = require('crypto');

const PRIVATE_KEY = 'M4_sECu|-e_UNK3Y';

exports.generateOTPCode = () => {
  return Array(4)
    .fill('0123456789')
    .map(function (x) {
      return x[Math.floor(Math.random() * x.length)];
    })
    .join('');
};

exports.signMessage = (message) => {
  const sha256Engine = crypto.createHmac('sha256', PRIVATE_KEY);
  const hash = sha256Engine.update(message).digest('hex');
  return hash;
};
