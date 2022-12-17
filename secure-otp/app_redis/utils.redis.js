const client = require('./client.redis');

class RedisHelpers {
  static setValue = async (key, value) => {
    await client.set(key, value, 'EX', 60 * 30);
  };
  static getValue = async (key) => {
    return await client.get(key);
  };
  static deleteValue = async (key) => {
    await client.del(key);
  };
}

module.exports = RedisHelpers;
