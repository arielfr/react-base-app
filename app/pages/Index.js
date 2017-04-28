/**
 * Created by arey on 4/28/17.
 */
const React = require('react');
const {Component} = require('react');
const Layout = require('./components/Layout/Layout').default;

class App extends Component {
  constructor(props) {
    super(props);

    // Set initial state from props
    this.state = this.props.initialState;
  }

  componentDidMount() {
    alert('Cargo');
  }

  render() {
    const content = (<div>
        <p onClick={this.click}>Contenido</p>
      </div>
    );

    return (
      <Layout userAgent={this.state.userAgent}>
        {content}
      </Layout>
    )
  }
}

module.exports = App;
