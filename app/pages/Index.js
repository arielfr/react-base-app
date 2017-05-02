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
    //alert('Cargo 4');
    console.log('cargo...')
  }

  handleClick() {
    let number = this.state.number;

    this.setState({
      number: number === undefined ? 1 : (number + 1)
    });
  }

  render() {
    const content = (<div>
        <p onClick={this.handleClick.bind(this)}>Contenido</p>
        <p>{this.state.number}</p>
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
