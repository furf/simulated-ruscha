import mongoose, { Schema } from 'mongoose';

const Tweet = new Schema({
  tweetID: {
    type: String,
    required: true,
    index: { unique: true },
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

Tweet.static('findOneByTweetID', function(tweetID, callback) {
  return this.findOne({ tweetID }, callback);
});

Tweet.static('getSinceID', function(callback) {
  return this.findOne().select('tweetID').sort('-tweetID')
    .exec(function(error, result) {
      if (error) {
        return callback(error);
      }
      if (result) {
        const sinceID = result.tweetID.toString();
        callback(null, sinceID);
      } else {
        callback(null, null);
      }
    });
});

Tweet.static('bulkUpsert', function(tweets, callback) {
  const bulk = this.collection.initializeUnorderedBulkOp();
  tweets.forEach(tweet => {
    bulk.find({ tweetID: tweet.tweetID }).upsert().updateOne(tweet);
  });
  bulk.execute(callback);
});

Tweet.virtual('id').get(function() {
  return this._id.toHexString();
});

Tweet.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Tweet', Tweet);
