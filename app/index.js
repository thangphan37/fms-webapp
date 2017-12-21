import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'url-search-params-polyfill';
import FmsButtonTest from './components/FmsButton/FmsButtonTest'

import {configure} from './store/configureStore';
import FmsApp from './pages/FmsApp';

const store = configure();

// Load Bootstrap js
require("bootstrapJs");

//Load Css js
require('../app/composeCss')


ReactDOM.render(
	<Provider store={store}>
		<Router>
		  <Switch>
			  <Route path="/" component={FmsApp}/>
		  </Switch>
		</Router>
	</Provider>,
	document.getElementById('app')
);
