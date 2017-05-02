/**
 * Created by arey on 4/28/17.
 */
/**
 * Module dependencies
 */

const React = require('react');
const ReactDOM = require('react-dom');
const {AppContainer} = require('react-hot-loader');


const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component initialState={window.__PRELOADED_STATE__}/>
    </AppContainer>,
    document.getElementById('root')
  );
};


const IndexView = require('../pages/Index');

render(IndexView);

if (module.hot) {
  module.hot.accept('../pages/Index', () => {
    // This is not needed if we use ES2015 Imports (But I use required)
    const NextRootContainer = require('../pages/Index');
    render(NextRootContainer);
  });
}