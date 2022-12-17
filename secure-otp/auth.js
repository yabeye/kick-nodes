const router = require('express').Router();

const { generateOTPCode, signMessage } = require('./utils/crypto.utils');
const RedisHelpers = require('./app_redis/utils.redis');

/**
  ** HOW AUTHENTICATION WORKS! **
  1. Generate a hash, based on the new otp code generated and use the hash value as key for redis.
  2. Based on the user's input of otpCode, Generate a hash and use the hash to check the available value on redis. 
    a. If not value is associated with the hash key, means no otp code is assigned i.e NOT AUTHENTICATED)
    b. else continue other functionality  
*/

router.post('/otp', async (req, res, next) => {
  //   let { phone } = req.body;
  const phone = '123456789';
  // const generatedOTP = generateOTPCode();
  const generatedOTP = '1234';

  const message = [phone, generatedOTP].join('');
  const hashDigest = signMessage(message);

  await RedisHelpers.setValue(
    hashDigest,
    JSON.stringify({ count: 0, at: Date.now() })
  );

  //TODO: send SMS for to <phone> of code <generatedOTP>

  return res.json({
    message: 'Successfully send otp!',
  });
});

router.post('/verify', async (req, res, next) => {
  // const { phone, otpCode } = req.body;
  const phone = '123456789';
  const otpCode = '1234';
  const message = [phone, otpCode].join('');

  let resMessage = '';
  const hashDigest = signMessage(message);
  const isOtpHashFoundInRedis = await RedisHelpers.getValue(hashDigest);
  if (isOtpHashFoundInRedis) {
    // TODO: Proceed with other authentication procedure!
    resMessage = 'AUTHENTICATED';
    await RedisHelpers.deleteValue(hashDigest);
  } else {
    //TODO: If redis[hash] count === 3, then delete a redis[hash]! so that the otp is invalid!
    //TODO: Add 1 to redis count (MAX_TRIAL= 3) and Return a not authenticated error message!
    resMessage = 'NOT AUTHENTICATED';
  }

  return res.json({
    message: resMessage,
  });
});

module.exports = router;
