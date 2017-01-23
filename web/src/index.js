import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import App from './App';
import TweetsPage from './TweetsPage';
import TweetPage from './TweetPage';
import NotFoundPage from './NotFoundPage';
import './index.css';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="/tweets" component={TweetsPage}/>
      <Route path="/tweets/:tweetID" component={TweetPage}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>,
  document.getElementById('root')
);
