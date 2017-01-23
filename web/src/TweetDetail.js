import React from 'react';

function TweetDetail(props) {
  const { tweet } = props;
  return (
    <div className="tweet-detail">
      <h1>{tweet.text}</h1>
      <pre>{JSON.stringify(tweet.sentences.map(s => s.tokens.map(t => `${t.word} (${t.pos})`)), 0, 2)}</pre>
    </div>
  );
}

export default TweetDetail;
