/**
 * Created by arey on 2/14/17.
 */
const React = require('react');
const Head = require('react-declarative-head');

module.exports = (props) => {
  const pageTitle = props.pageTitle || 'React Base App';
  const pageDescription = props.pageDescription || 'React Base Application With Hot Module Replacing';

  return (
    <div className="App">
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription}/>
      </Head>
      <div id="root">
        {'{{children}}'}
      </div>
    </div>
  )
};
