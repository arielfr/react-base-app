/**
 * Created by arey on 4/28/17.
 */
/**
 * Module dependencies
 */

require('react-hot-loader/patch');

const React = require('react');
const ReactDOM = require('react-dom');
const {AppContainer} = require('react-hot-loader');
const IndexView = require('../pages/Index');

/**
 * Mount DemoView on client
 */
ReactDOM.render(
  <AppContainer>
    <IndexView initialState={window.__PRELOADED_STATE__}/>
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('../pages/Index', () => {
    // This is not needed if we use ES2015 Imports (But I use required)
    const NextRootContainer = require('../pages/Index');

    ReactDOM.render(
      <AppContainer>
        <NextRootContainer initialState={window.__PRELOADED_STATE__}/>
      </AppContainer>,
      document.getElementById('root')
    )
  });
}