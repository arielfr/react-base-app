/**
 * Created by arey on 4/28/17.
 */
/**
 * Module dependencies
 */
const React = require('react');
const ReactDOM = require('react-dom');
const IndexView = require('../pages/Index');

/**
 * Mount DemoView on client
 */
ReactDOM.render(
  <IndexView initialState={window.__PRELOADED_STATE__}/>,
  document.getElementById('root'),
);
