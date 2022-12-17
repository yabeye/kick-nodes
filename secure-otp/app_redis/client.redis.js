const redis = require('redis');

const client = redis.createClient({
  host: '127.0.0.1',
});

process.on('ready', () => {
  console.log('redis is ready!');
});

process.on('SIGINT', () => {
  client.quit();
});

(async () => {
  await client.connect();
})();

module.exports = client;
