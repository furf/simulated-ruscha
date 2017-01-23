import request from 'request';
import Twitter from 'twitter';

const TWITTER_OAUTH_URL = 'https://api.twitter.com/oauth2/token';

// Twitter client singleton instance stored as promise.
let instance = null;

export function createTwitterClient(consumerKey, consumerSecret) {
  if (!instance) {
    instance = new Promise((resolve, reject) => {
      const credentials = `${consumerKey}:${consumerSecret}`;
      const credentials64 = new Buffer(credentials).toString('base64');
      request({
        url: TWITTER_OAUTH_URL,
        method:'POST',
        headers: {
          Authorization: `Basic ${credentials64}`,
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: 'grant_type=client_credentials'
      }, function(error, response, body) {
        if (error) {
          return reject(error);
        }
        const data = JSON.parse(body);
        const client = new Twitter({
          consumer_key: consumerKey,
          consumer_secret: consumerSecret,
          bearer_token: data.access_token,
        });
        resolve(client);
      });
    });
  }

  return instance;
}
