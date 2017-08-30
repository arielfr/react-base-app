/**
 * Created by arey on 4/28/17.
 */
const { render } = require('./utils/renderer');

// You need to load the LESS here because this is the entry point on Webpack
require('../pages/index/index.less');

const IndexView = require('../pages/index');

render(IndexView);
