/* eslint-disable import/default */

import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

// import {Immutable} from 'immutable';
import configureStore from './store/configureStore';
require('./favicon.ico'); // Tell webpack to load favicon.ico
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; //Webpack can import CSS files too!
import './styles/styles.scss'; // Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import { syncHistoryWithStore } from 'react-router-redux';

import initialState from './reducers/initialState';


const store = configureStore(initialState);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState (state) {
      return state.get('routing').toJS();
  }
});

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, document.getElementById('app')
);
