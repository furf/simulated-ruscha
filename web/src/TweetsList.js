import React from 'react';
import TweetsListItem from './TweetsListItem';

function TweetsList(props) {
  const { tweets } = props;
  return (
    <ul className="tweets-list">
      {tweets.map(tweet => <TweetsListItem key={tweet.id} tweet={tweet}/>)}
    </ul>
  );
}

export default TweetsList;
