/**
 * Created by arey on 4/28/17.
 */
const React = require('react');
const ReactDOM = require('react-dom');
const {AppContainer} = require('react-hot-loader');

const IndexView = require('../pages/Index').default;

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component initialState={window.__PRELOADED_STATE__}/>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(IndexView);

if (module.hot) {
  module.hot.accept('../pages/Index', () => {
    const NextRootContainer = require('../pages/Index').default;
    render(NextRootContainer);
  });
}