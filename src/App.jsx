import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import MainContainer from './components/MainContainer.js';
import './App.css';

render(
  <Provider store={store}>
    <MainContainer />
  </Provider>,
  document.getElementById('root'),
);
