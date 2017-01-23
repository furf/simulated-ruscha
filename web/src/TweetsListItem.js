import React from 'react';
import { Link } from 'react-router';

function TweetsList(props) {
  const { tweet } = props;
  return (
    <li className="tweets-list-item">
      <Link to={`/tweets/${tweet.tweetID}`}>
        {tweet.text}
      </Link>
    </li>
  );
}

export default TweetsList;
