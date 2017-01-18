import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import AboutPage from './components/AboutPage';
import CustomerSearchPage from './components/CustomerSearchPage';
import CustomerPage from './components/CustomerPage';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={CustomerSearchPage}/>
    <Route path="customer-search" component={CustomerSearchPage}/>
    <Route path="customer" component={CustomerPage}/>
    <Route path="about" component={AboutPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);
