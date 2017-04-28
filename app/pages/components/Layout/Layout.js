/**
 * Created by arey on 2/14/17.
 */
const React = require('react');
const {Component} = require('react');
const Head = require('react-declarative-head');

class Layout extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const pageTitle = this.props.pageTitle || 'Hermes';
    const pageDescription = this.props.pageDescription || 'Email Sender';

    return (
      <div className="App">
        <Head>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription}/>
        </Head>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Layout;