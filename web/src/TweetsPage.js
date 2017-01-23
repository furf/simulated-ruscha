import React, { Component } from 'react';
import createFragment from 'react-addons-create-fragment';
import api from './helpers/api';
import LoadingIndicator from './LoadingIndicator';
import TweetsList from './TweetsList';
import Error from './Error';

class TweetsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: null,
      error: null,
    };
  }

  componentWillMount() {
    this.loadTweets().then(this.handleLoadTweets, this.handleLoadTweetsError);
  }

  loadTweets() {
    return api('tweets');
  }

  handleLoadTweets = data => {
    this.setState({ tweets: data.results });
  }

  handleLoadTweetsError = error => {
    window.alert(error.message);
  }

  render() {
    const { tweets, error } = this.state;
    const children = {};

    if (tweets) {
      children.tweets = <TweetsList tweets={tweets}/>;
    } else if (error) {
      children.error = <Error message={error}/>;
    } else {
      children.loadingIndicator = <LoadingIndicator/>
    }

    return (
      <div className="tweets-page">
        {createFragment(children)}
      </div>
    );
  }
}

export default TweetsPage;
