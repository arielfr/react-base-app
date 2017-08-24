/**
 * Created by arey on 4/28/17.
 */
const React = require('react');
const { Component } = require('react');
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
      <div className="index">
        <p>Contenido</p>
        <Number />
      </div>
    )
  }
}

module.exports = App;
