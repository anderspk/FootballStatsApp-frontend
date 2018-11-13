import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promise from 'redux-promise';
import Routes from './Routes';
import './i18n';


import reducers from './reducers/rootReducer';


const createStoreWithMiddleware = applyMiddleware(promise)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)} >
    <Routes />
  </Provider>
  , document.getElementById('root'));


serviceWorker.unregister();