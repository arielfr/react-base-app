/**
 * Created by arey on 4/28/17.
 */
const React = require('react');
const {Component} = require('react');
const Layout = require('../../components/Layout/Layout');
const Number = require('./components/Number/Number');

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log('cargo...');
  }

  render() {
    return (
      <Layout>
        <div>
          <p>Contenido</p>
          <Number/>
        </div>
      </Layout>
    )
  }
}

module.exports = App;
