import { createMongooseClient } from './clients/mongoose';
import { createTwitterClient } from './clients/twitter';
import { createCoreNLPClient } from './clients/corenlp';
import restify from 'restify';
import * as catRoutes from './routes/cat';
import Tweet from './models/tweet';

const {
  DB_URI,
  NLP_URL,
  TWITTER_CONSUMER_KEY,
  TWITTER_CONSUMER_SECRET,
  PORT,
} = process.env;

Promise.all([
  createMongooseClient(DB_URI),
  createTwitterClient(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET),
  createCoreNLPClient(NLP_URL),
]).then(([mongoose, twitter, corenlp]) => {

  // Initialize Restify server.
  const server = restify.createServer({
    name: 'cats',
  });

  // Apply middleware.
  server.use(restify.bodyParser());
  server.use(restify.CORS());

  // Assign routes.
  server.get('/cats', catRoutes.list);
  server.post('/cats', catRoutes.create);
  server.get('/cats/:name', catRoutes.retrieve);
  server.del('/cats/:id', catRoutes.destroy);

  server.get('/nlp/:string', (req, res, next) => {
    corenlp.parse(req.params.string, (error, results) => {
      if (error) {
        return next(new restify.errors.InternalServerError(error));
      }
      res.send({ results });
      return next();
    });
  });

  server.get('/tweets/ingest', (req, res, next) => {

    Tweet.getSinceID((error, result) => {
      if (error) {
        console.log('getSinceID', error);
        return next(new restify.errors.InternalServerError(error));
      }
      ingestTweets(result);
    });

    const aggregatedResults = {
      nInserted: 0,
      nUpserted: 0,
      nMatched: 0,
      nModified: 0,
      nRemoved: 0,
    };
    const path = 'statuses/user_timeline.json';

    function ingestTweets(sinceID, maxID) {
      console.log(`ingestTweets(${sinceID}, ${maxID})`);
      const params = {
        screen_name: 'NYTMinusContext',
        count: 200,
        trim_user: true,
        exclude_replies: true,
        contributor_details: false,
        include_rts: false,
      };

      if (sinceID) {
        params.since_id = sinceID;
      }

      if (maxID) {
        params.max_id = maxID;
      }

      twitter.get(path, params, (error, results, response) => {
        if (error) {
          console.log('twitter.get', error);
          return next(new restify.errors.InternalServerError(error));
        }

        if (results.length === 0) {
          res.send(aggregatedResults);
          return next();
        }

        // Transform tweet data for insert.
        const tweets = results.map(result => ({
          tweetID: result.id_str,
          text: result.text,
          createdAt: result.created_at,
        }));

        Tweet.bulkUpsert(tweets, (error, results) => {
          if (error) {
            console.log('bulkUpsert', error);
            return next(new restify.errors.InternalServerError(error));
          }

          aggregatedResults.nInserted += results.nInserted;
          aggregatedResults.nUpserted += results.nUpserted;
          aggregatedResults.nMatched += results.nMatched;
          aggregatedResults.nModified += results.nModified;
          aggregatedResults.nRemoved += results.nRemoved;

          if (tweets.length > 1) {
            const maxID = tweets[tweets.length - 1].tweetID.toString();
            ingestTweets(sinceID, maxID);
          } else {
            res.send(aggregatedResults);
            return next();
          }
        });
      });
    }
  });

  server.get('/tweets', (req, res, next) => {
    Tweet.find((error, results) => {
      if (error) {
        return next(new restify.errors.InternalServerError(error));
      }
      res.send({ results });
      return next();
    });
  });

  server.get('/tweets/:tweetID', (req, res, next) => {
    Tweet.findOneByTweetID(req.params.tweetID, (error, tweet) => {
      if (error) {
        console.log(1, error);
        return next(new restify.errors.InternalServerError(error));
      }
      if (!tweet) {
        return next(new restify.errors.NotFoundError());
      }
      corenlp.parse(tweet.text, (error, nlp) => {
        if (error) {
          console.log(2, error);
          return next(new restify.errors.InternalServerError(error));
        }
        const result = Object.assign({}, tweet.toJSON(), nlp);
        res.send({ result });
        return next();
      });
    });
  });

  // Start server.
  server.listen(PORT, () => {
    console.log('%s listening at %s', server.name, server.url);
  });

}).catch(error => {
  console.warn(error);
});
