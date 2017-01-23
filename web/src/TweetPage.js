import React, { Component } from 'react';
import createFragment from 'react-addons-create-fragment';
import api from './helpers/api';
import LoadingIndicator from './LoadingIndicator';
import TweetDetail from './TweetDetail';
import Error from './Error';

class TweetPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweet: null,
      error: null,
    };
  }

  componentWillMount() {
    this.loadTweet().then(this.handleLoadTweet, this.handleLoadTweetError);
  }

  loadTweet() {
    return api(`tweets/${this.props.params.tweetID}`);
  }

  handleLoadTweet = data => {
    this.setState({ tweet: data.result });
  }

  handleLoadTweetError = error => {
    window.alert(error.message);
  }

  render() {
    const { tweet, error } = this.state;
    const children = {};

    if (tweet) {
      children.tweet = <TweetDetail tweet={tweet}/>;
    } else if (error) {
      children.error = <Error message={error}/>;
    } else {
      children.loadingIndicator = <LoadingIndicator/>
    }

    return (
      <div className="tweet-page">
        {createFragment(children)}
      </div>
    );
  }
}

export default TweetPage;
