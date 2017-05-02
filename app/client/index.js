/**
 * Created by arey on 4/28/17.
 */
/**
 * Module dependencies
 */
const React = require('react');
const ReactDOM = require('react-dom');
const IndexView = require('../pages/Index');

const {AppContainer} = require('react-hot-loader');
const patch = require('react-hot-loader/patch');

/**
 * Mount DemoView on client
 */
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
} else {
  ReactDOM.render(
    <AppContainer>
      <IndexView initialState={window.__PRELOADED_STATE__}/>
    </AppContainer>,
    document.getElementById('root')
  );
}